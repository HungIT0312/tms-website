const cardModel = require("../Models/cardModel");
const listModel = require("../Models/listModel");
const boardModel = require("../Models/boardModel");
const userModel = require("../Models/userModel");
const helperMethods = require("./helperMethods");
const dayjs = require("dayjs");
const weekday = require("dayjs/plugin/weekday");
const localeData = require("dayjs/plugin/localeData");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(localeData);
const { emitToUser } = require("../utils/socket");
const notificationModal = require("../Models/notificationModal");
const _ = require("lodash");
const create = async (
  title,
  listId,
  boardId,
  user,
  parentCardId = null,
  callback
) => {
  try {
    // Get list and board
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate the ownership
    const validate = await helperMethods.validateCardOwners(
      null,
      list,
      board,
      user,
      true
    );
    if (!validate) {
      return callback({
        errMessage: "Bạn không có quyền thêm thẻ vào danh sách hoặc bảng này",
      });
    }

    const card = new cardModel({ title: title });
    card.owner = listId;
    card.date.resolvedAt = null;
    if (parentCardId) {
      card.isSubTaskOf = parentCardId;

      const parentCard = await cardModel.findById(parentCardId);
      if (parentCard) {
        parentCard.subTasks.push(card._id);
        await parentCard.save();
      } else {
        return callback({
          errMessage: "Không tìm thấy thẻ cha",
        });
      }
    }

    card.activities.unshift({
      user: user._id,
      action: `đã thêm thẻ vào danh sách "${list.title}"`,
    });

    await card.save();

    // Add id of the new card to owner list
    list.cards.push(card._id);
    await list.save();

    // Add log to board activity
    board.activity.unshift({
      user: user._id,
      action: `đã thêm thẻ "${card.title}" vào bảng`,
    });
    await board.save();

    // Populate all references
    const updateCard = await cardModel
      .findById(card._id)
      .populate({
        path: "activities.user",
        select: "name surname email color",
      })
      .populate({
        path: "members.user",
        select: "name surname email color",
      })
      .populate({
        path: "watchers.user",
        select: "name",
      })
      .populate({
        path: "labels",
      });
    return callback(false, {
      message: "Thêm thành công!",
      card: updateCard,
    });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const deleteById = async (
  cardId,
  listId,
  boardId,
  user,
  deleteSubtasks,
  callback
) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return callback({
        errMessage: "Bạn không có quyền cập nhật thẻ này",
      });
    }

    if (deleteSubtasks) {
      const deleteCardAndSubtasks = async (card) => {
        const subtasks = await cardModel.find({ isSubTaskOf: card._id });
        for (const subtask of subtasks) {
          await deleteCardAndSubtasks(subtask);
        }
        await cardModel.findByIdAndDelete(card._id);
      };

      await deleteCardAndSubtasks(card);
    } else {
      const subtasks = await cardModel.find({ isSubTaskOf: card._id });
      for (const subtask of subtasks) {
        subtask.isSubTaskOf = null;
        await subtask.save();
      }
      await cardModel.findByIdAndDelete(card._id);
    }

    if (card.isSubTaskOf) {
      const parentCard = await cardModel.findById(card.isSubTaskOf);
      if (parentCard) {
        parentCard.subTasks = parentCard.subTasks.filter(
          (subTaskId) => subTaskId.toString() !== cardId
        );
        await parentCard.save();
      }
    }

    list.cards = list.cards.filter(
      (tempCard) => tempCard.toString() !== cardId
    );
    await list.save();

    board.activity.unshift({
      user: user._id,
      action: `đã xóa "${card.title}" khỏi danh sách "${list.title}"`,
    });
    await board.save();

    return callback(false, { message: "Thành công" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const getCard = async (cardId, user, callback) => {
  try {
    const card = await cardModel
      .findById(cardId)
      // .populate({
      //   path: "activities.user",
      //   select: "name surname email color",
      // })
      .populate({
        path: "members.user",
        select: "name surname email color",
      })
      .populate({
        path: "watchers.user",
        select: "name",
      })
      .populate("labels")
      .populate("isSubTaskOf")
      .populate({
        path: "subTasks",
        populate: {
          path: "activities.user members.user watchers.user labels",
          select: "name surname email color",
        },
      })
      .exec();

    if (!card) {
      return callback({
        errMessage: "Không tìm thấy thẻ",
      });
    }
    card.activities = undefined;
    delete card.activities;
    return callback(false, card);
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const update = async (cardId, listId, boardId, user, updatedObj, callback) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return callback({
        errMessage: "Bạn không có quyền cập nhật thẻ này",
      });
    }
    card.activities.unshift({
      user: user._id,
      action: `đã cập nhật thông tin thẻ này`,
    });
    await card.save();

    //Update card
    await card.updateOne(updatedObj);
    const updatedCard = await cardModel
      .findById(cardId)
      .populate({
        path: "activities.user",
      })
      .populate({
        path: "members.user",
      })
      .populate({
        path: "watchers.user",
      })
      .populate({
        path: "labels",
      });
    board.activity.unshift({
      user: user._id,
      action: `đã cập nhật thông tin thẻ "${updatedCard.title}" trong danh sách "${list.title}"`,
    });
    await board.save();

    return callback(false, { message: "Thành công!", card: updatedCard });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const addComment = async (cardId, listId, boardId, user, text, callback) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return callback({
        errMessage: "Bạn không có quyền cập nhật thẻ này",
      });
    }

    //Add comment
    card.activities.unshift({
      user: user._id,
      action: text,
      actionType: "comment",
      cardTitle: card.title,
      isComment: true,
    });
    await card.save();
    const newComments = await cardModel
      .findById(cardId)
      .populate("activities.user");
    board.activity.unshift({
      user: user._id,
      action: `đã thêm một bình luận trong thẻ "${card.title}"`,
    });
    board.save();

    return callback(false, newComments.activities[0]);
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const updateComment = async (
  cardId,
  listId,
  boardId,
  commentId,
  user,
  text,
  callback
) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      errMessage: "You dont have permission to update this card";
    }

    //Update card
    card.activities = card.activities.map((activity) => {
      if (activity._id.toString() === commentId.toString()) {
        if (activity.user.toString() !== user._id.toString()) {
          return callback({
            errMessage:
              "Bạn không thể chỉnh sửa bình luận mà bạn chưa thực hiện",
          });
        }
        activity.action = text; // Update the comment text
        activity.isComment = true; // Mark the activity as a comment
      }
      return activity;
    });
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `đã thay đổi một bình luận trong thẻ "${card.title}"`,
    });
    board.save();

    return callback(false, { message: "Thành công!" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const deleteComment = async (
  cardId,
  listId,
  boardId,
  commentId,
  user,
  callback
) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      errMessage: "You dont have permission to update this card";
    }

    //Delete card
    card.activities = card.activities.filter(
      (activity) => activity._id.toString() !== commentId.toString()
    );
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `đã xóa 1 bình luận ra khỏi "${card.title}"`,
    });
    board.save();

    return callback(false, { message: "Thành công!" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const changeCardMember = async (
  cardId,
  listId,
  boardId,
  user,
  memberId,
  callback
) => {
  try {
    // Fetch models
    const [card, list, board, member] = await Promise.all([
      cardModel.findById(cardId),
      listModel.findById(listId),
      boardModel.findById(boardId),
      userModel.findById(memberId),
    ]);

    // Validate owner
    const isOwnerValid = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!isOwnerValid) {
      return callback({
        errMessage: "Bạn không có quyền thêm thành viên vào thẻ này",
      });
    }

    // Add member to card
    card.members = [
      {
        user: member._id,
        name: member.name,
        surname: member.surname,
        email: member.email,
        color: member.color,
      },
    ];
    card.activities.unshift({
      user: user._id,
      action: `thay đổi người được chỉ định thành "${member.surname} ${member.name}"`,
    });

    await card.save();

    // Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `thay đổi người được chỉ định thành "${member.surname} ${member.name}" trong thẻ "${card.title}"`,
    });
    const slugB = _.kebabCase(board.title.toLowerCase());
    // const slugC = _.kebabCase(card.title.toLowerCase());
    await board.save();
    if (user._id != memberId) {
      const newNotice = await notificationModal.create({
        user: member._id,
        message:
          "<p> Bạn đã được thêm vào thẻ <b>" +
          card.title +
          "</b> trong bảng <b>" +
          board.title +
          "</b>",
        link: `/board/${boardId}/${slugB}`,
      });
      const returnNotice = await notificationModal
        .findById(newNotice._id)
        .populate("user");
      emitToUser(member._id.toString(), "changeCardMember", {
        newNotice: returnNotice,
      });
    }
    const newCard = await cardModel
      .findById(card._id)
      .populate("members.user")
      .select("name surname _id email color");
    return callback(false, { message: "Thành công", member: newCard.members });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const updateStartDueDates = async (
  cardId,
  listId,
  boardId,
  user,
  startDate,
  dueDate,
  dueTime,
  completed,
  callback
) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);
    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      callback({
        errMessage: "Bạn không có quyền cập nhật ngày của thẻ này",
      });
    }
    //Update dates
    if (startDate) {
      card.date.startDate = dayjs(startDate).toDate();
    }
    if (dueDate) {
      card.date.dueDate = dayjs(dueDate).toDate();
    }
    if (dueTime) {
      card.date.dueTime = dueTime;
    }
    if (startDate || dueDate) {
      card.activities.unshift({
        user: user._id,
        action: `đã cập nhật ngày đến hạn bắt đầu ${
          startDate ? dayjs(startDate).format("DD/MM/YYYY") : "từ chưa có ngày"
        } đến ${dueDate ? dayjs(dueDate).format("DD/MM/YYYY") : "hạn cuối"}`,
      });
    }
    const now = dayjs();
    if (card.date.completed !== completed) {
      card.date.completed = completed;
      if (completed) {
        card.date.resolvedAt = now;
        card.activities.unshift({
          user: user._id,
          action: `đã cập nhật trạng thái của thẻ là hoàn thành`,
        });
      } else {
        card.date.resolvedAt = null;
        if (dueDate === null) {
          card.date.completed = false;
        }
        card.activities.unshift({
          user: user._id,
          action: `đã cập nhật trạng thái của thẻ là chưa hoàn thành`,
        });
      }
    }

    await card.save();
    return callback(false, { message: "Cập nhật thành công!" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const addAttachment = async (
  cardId,
  listId,
  boardId,
  user,
  link,
  name,
  callback
) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      errMessage: "You dont have permission to update date of this card";
    }

    //Add attachment
    const validLink = new RegExp(/^https?:\/\//).test(link)
      ? link
      : "http://" + link;

    card.attachments.push({ link: validLink, name: name });
    card.activities.unshift({
      user: user._id,
      action: `đã thêm tệp đính kèm "${name}"`,
    });
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `đã thêm tệp đính kèm ${name} vào thẻ ${card.title}`,
    });
    board.save();

    return callback(false, {
      attachment: card.attachments[card.attachments.length - 1],
    });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const deleteAttachment = async (
  cardId,
  listId,
  boardId,
  user,
  attachmentId,
  callback
) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      errMessage: "You dont have permission to delete this attachment";
    }

    let attachmentObj = card.attachments.filter(
      (attachment) => attachment._id.toString() === attachmentId.toString()
    );

    //Delete checklistItem
    card.attachments = card.attachments.filter(
      (attachment) => attachment._id.toString() !== attachmentId.toString()
    );
    card.activities.unshift({
      user: user._id,
      action: `đã xóa một tệp đính kèm khỏi thẻ`,
    });
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `đã xóa tệp đính kèm khỏi thẻ "${card.title}"`,
    });
    board.save();

    return callback(false, { message: "Thành công!" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const updateAttachment = async (
  cardId,
  listId,
  boardId,
  user,
  attachmentId,
  link,
  name,
  callback
) => {
  try {
    // Get models
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      errMessage: "You dont have permission to update attachment of this card";
    }

    card.attachments = card.attachments.map((attachment) => {
      if (attachment._id.toString() === attachmentId.toString()) {
        attachment.link = link;
        attachment.name = name;
      }
      return attachment;
    });

    await card.save();
    return callback(false, { message: "Thành công!" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const updateCover = async (
  cardId,
  listId,
  boardId,
  user,
  color,
  isSizeOne,
  callback
) => {
  try {
    const card = await cardModel.findById(cardId);
    const list = await listModel.findById(listId);
    const board = await boardModel.findById(boardId);

    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      errMessage: "You dont have permission to update attachment of this card";
    }

    card.cover.color = color;
    card.cover.isSizeOne = isSizeOne;

    await card.save();
    return callback(false, { message: "Thành công!" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};
const addLabelToCard = async (cardId, labelId, callback) => {
  try {
    const card = await cardModel.findById(cardId);
    if (!card) {
      return callback({ errMessage: "Thẻ không tìm thấy" });
    }

    if (card.labels.includes(labelId)) {
      return callback({ errMessage: "Nhãn đã được thêm vào thẻ này" });
    }

    card.labels.push(labelId);
    await card.save();

    const card2 = await cardModel.findById(cardId);
    await card2.populate("labels");
    return callback(false, { labels: card2.labels });
  } catch (err) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: err.message,
    });
  }
};
const removeLabelFromCard = async (cardId, labelId, callback) => {
  try {
    const card = await cardModel.findById(cardId);
    if (!card) {
      return callback({ errMessage: "Thẻ không tìm thấy" });
    }

    const labelIndex = card.labels.findIndex(
      (l) => l._id.toString() === labelId.toString()
    );
    if (labelIndex === -1) {
      return callback({ errMessage: "Không tìm thấy nhãn trong thẻ này" });
    }

    card.labels.splice(labelIndex, 1);
    await card.save();

    return callback(false, { labelId });
  } catch (err) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: err.message,
    });
  }
};
const getActivitiesById = async (cardId, type, callback) => {
  try {
    const card = await cardModel.findById(cardId).populate("activities.user");
    if (!card) {
      return callback({ errMessage: "Không tìm thấy thẻ" });
    }

    const filteredActivities = card.activities
      .filter((activity) => activity.isComment == (type === "comment"))
      .map((activity) => {
        const activityObj = activity.toObject();
        if (activityObj.user) {
          delete activityObj.user.password;
          delete activityObj.user.verificationToken;
          delete activityObj.user.verified;
          delete activityObj.user.__v;
          delete activityObj.user.boards;
          delete activityObj.user.invitations;
        }
        return activityObj;
      });

    return callback(false, {
      activities: filteredActivities,
    });
  } catch (err) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: err.message,
    });
  }
};

module.exports = {
  create,
  update,
  getCard,
  addComment,
  deleteById,
  updateComment,
  deleteComment,
  changeCardMember,
  updateStartDueDates,
  addAttachment,
  deleteAttachment,
  updateAttachment,
  updateCover,
  addLabelToCard,
  removeLabelFromCard,
  getActivitiesById,
};
