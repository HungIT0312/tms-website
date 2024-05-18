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
const create = async (title, listId, boardId, user, callback) => {
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
    if (!validate)
      return callback({
        errMessage:
          "You don't have permission to add card to this list or board",
      });

    // Create new card
    const card = await cardModel({ title: title });
    card.owner = listId;

    card.activities.unshift({
      user: user._id,
      action: `added this card to list "${list.title}"`,
    });
    card.members.unshift({
      user: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      color: user.color,
      role: "owner",
    });

    // card.labels = helperMethods.labelsSeedColor;
    await card.save();

    // Add id of the new card to owner list
    list.cards.push(card._id);
    await list.save();

    // Add log to board activity
    board.activity.unshift({
      user: user._id,
      action: `added "${card.title}" to this board`,
    });
    await board.save();
    const updateCard = await cardModel
      .findById(card._id)
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
    // const result = await listModel.findById(listId).populate({ path: 'cards' }).exec();
    return callback(false, {
      message: "Add successful!",
      card: updateCard,
    });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const deleteById = async (cardId, listId, boardId, user, callback) => {
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

    // Delete the card
    const result = await cardModel.findByIdAndDelete(cardId);

    // Delete the list from lists of board
    list.cards = list.cards.filter(
      (tempCard) => tempCard.toString() !== cardId
    );
    await list.save();

    // Add activity log to board
    board.activity.unshift({
      user: user._id,
      action: `deleted ${result.title} from ${list.title}`,
    });
    await board.save();

    return callback(false, { message: "Success" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const getCard = async (cardId, listId, boardId, user, callback) => {
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

    let returnObject = {
      ...card._doc,
      listTitle: list.title,
      listId: listId,
      boardId: boardId,
    };

    return callback(false, returnObject);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
        errMessage: "You don't have permission to update this card",
      });
    }
    card.activities.unshift({
      user: user._id,
      action: `update this card in list "${list.title}"`,
    });
    board.activity.unshift({
      user: user._id,
      action: `update card in list "${list.title}"`,
    });
    //Update card
    await card.updateOne(updatedObj);
    await board.save();
    await card.save();
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
    return callback(false, { message: "Success!", card: updatedCard });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const addComment = async (cardId, listId, boardId, user, body, callback) => {
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
        errMessage: "You don't have permission to update this card",
      });
    }

    //Add comment
    card.activities.unshift({
      user: user._id,
      action: body.text,
      actionType: "comment",
      cardTitle: card.title,
      isComment: true,
    });
    await card.save();

    //Add comment to board activity
    board.activity.unshift({
      user: user._id,
      action: body.text,
      actionType: "comment",
      cardTitle: card.title,
    });
    board.save();

    return callback(false, card.activities);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
  body,
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
            errMessage: "You can not edit the comment that you haven't made",
          });
        }
        activity.action = body.text; // Update the comment text
        activity.isComment = true; // Mark the activity as a comment
      }
      return activity;
    });
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: body.text,
      actionType: "comment",
      edited: true,
      cardTitle: card.title,
    });
    board.save();

    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
      action: `deleted his/her own comment from ${card.title}`,
    });
    board.save();

    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
        errMessage: "You don't have permission to add member to this card",
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
      action: `change the assigned person to '${member.name}' in card ${card.title}`,
    });

    await card.save();

    // Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `change the assigned person to '${member.name}' in card ${card.title}' `,
    });

    await board.save();

    return callback(false, { message: "success", member: card.members });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const createChecklist = async (
  cardId,
  listId,
  boardId,
  user,
  title,
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
      errMessage: "You dont have permission to add Checklist this card";
    }

    //Add checklist
    card.checklists.push({
      title: title,
    });
    await card.save();

    const checklistId = card.checklists[card.checklists.length - 1]._id;

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `added '${title}' to ${card.title}`,
    });
    board.save();

    return callback(false, { checklistId: checklistId });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const deleteChecklist = async (
  cardId,
  listId,
  boardId,
  checklistId,
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
      errMessage: "You dont have permission to delete this checklist";
    }
    let cl = card.checklists.filter(
      (l) => l._id.toString() === checklistId.toString()
    );
    //Delete checklist
    card.checklists = card.checklists.filter(
      (list) => list._id.toString() !== checklistId.toString()
    );
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `removed '${cl.title}' from ${card.title}`,
    });
    board.save();

    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const addChecklistItem = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
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
      errMessage: "You dont have permission to add item this checklist";
    }

    //Add checklistItem
    card.checklists = card.checklists.map((list) => {
      if (list._id.toString() == checklistId.toString()) {
        list.items.push({ text: text });
      }
      return list;
    });
    await card.save();

    // Get to created ChecklistItem's id
    let checklistItemId = "";
    card.checklists = card.checklists.map((list) => {
      if (list._id.toString() == checklistId.toString()) {
        checklistItemId = list.items[list.items.length - 1]._id;
      }
      return list;
    });
    return callback(false, { checklistItemId: checklistItemId });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const setChecklistItemCompleted = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
  checklistItemId,
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
      errMessage: "You dont have permission to set complete of this checklist item";
    }
    let clItem = "";
    //Update completed of checklistItem
    card.checklists = card.checklists.map((list) => {
      if (list._id.toString() == checklistId.toString()) {
        list.items = list.items.map((item) => {
          if (item._id.toString() === checklistItemId) {
            item.completed = completed;
            clItem = item.text;
          }
          return item;
        });
      }
      return list;
    });
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: completed
        ? `completed '${clItem}' on ${card.title}`
        : `marked as uncompleted to '${clItem}' on ${card.title}`,
    });
    board.save();

    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const setChecklistItemText = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
  checklistItemId,
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
      errMessage: "You dont have permission to set text of this checklist item";
    }

    //Update text of checklistItem
    card.checklists = card.checklists.map((list) => {
      if (list._id.toString() == checklistId.toString()) {
        list.items = list.items.map((item) => {
          if (item._id.toString() === checklistItemId) {
            item.text = text;
          }
          return item;
        });
      }
      return list;
    });
    await card.save();
    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const deleteChecklistItem = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
  checklistItemId,
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
      errMessage: "You dont have permission to delete this checklist item";
    }

    //Delete checklistItem
    card.checklists = card.checklists.map((list) => {
      if (list._id.toString() == checklistId.toString()) {
        list.items = list.items.filter(
          (item) => item._id.toString() !== checklistItemId
        );
      }
      return list;
    });
    await card.save();
    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
        errMessage: "You dont have permission to update date of this card",
      });
    }
    //Update dates
    if (startDate) {
      card.date.startDate = new Date(startDate);
    }
    if (dueDate) {
      card.date.dueDate = new Date(dueDate);
    }
    if (dueTime) {
      card.date.dueTime = dueTime;
    }

    card.date.completed = completed;
    if (dueDate === null) card.date.completed = false;
    await card.save();
    return callback(false, { message: "Update success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const updateDateCompleted = async (
  cardId,
  listId,
  boardId,
  user,
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
        errMessage: "You dont have permission to update date of this card",
      });
    }

    //Update date completed event
    card.date.completed = completed;

    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `marked the due date on ${card.title} ${
        completed ? "complete" : "uncomplete"
      }`,
    });
    board.save();

    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `attached ${validLink} to ${card.title}`,
    });
    board.save();

    return callback(false, {
      attachmentId:
        card.attachments[card.attachments.length - 1]._id.toString(),
    });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
    await card.save();

    //Add to board activity
    board.activity.unshift({
      user: user._id,
      action: `deleted the ${attachmentObj[0].link} attachment from ${card.title}`,
    });
    board.save();

    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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

    // Validate owner
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

    //Update date completed event
    card.attachments = card.attachments.map((attachment) => {
      if (attachment._id.toString() === attachmentId.toString()) {
        attachment.link = link;
        attachment.name = name;
      }
      return attachment;
    });

    await card.save();
    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
      errMessage: "You dont have permission to update attachment of this card";
    }

    //Update date cover color
    card.cover.color = color;
    card.cover.isSizeOne = isSizeOne;

    await card.save();
    return callback(false, { message: "Success!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};
const addLabelToCard = async (cardId, labelId, callback) => {
  try {
    // Tìm thẻ theo ID
    const card = await cardModel.findById(cardId);
    if (!card) {
      return callback({ errMessage: "Card not found" });
    }

    // Kiểm tra xem nhãn đã tồn tại trong thẻ chưa
    if (card.labels.includes(labelId)) {
      return callback({ errMessage: "Label already added to this card" });
    }

    // Thêm nhãn vào danh sách nhãn của thẻ
    card.labels.push(labelId);
    await card.save();

    const card2 = await cardModel.findById(cardId);
    await card2.populate("labels");
    return callback(false, { labels: card2.labels });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const removeLabelFromCard = async (cardId, labelId, callback) => {
  try {
    // Tìm thẻ theo ID
    const card = await cardModel.findById(cardId);
    if (!card) {
      return callback({ errMessage: "Card not found" });
    }

    // // Kiểm tra xem nhãn có tồn tại trong thẻ không
    const labelIndex = card.labels.findIndex(
      (l) => l._id.toString() === labelId.toString()
    );
    if (labelIndex === -1) {
      return callback({ errMessage: "Label not found in this card" });
    }

    // Xóa nhãn khỏi danh sách nhãn của thẻ
    card.labels.splice(labelIndex, 1);
    await card.save();

    return callback(false, { labelId });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
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
  createChecklist,
  deleteChecklist,
  addChecklistItem,
  setChecklistItemCompleted,
  setChecklistItemText,
  deleteChecklistItem,
  updateStartDueDates,
  updateDateCompleted,
  addAttachment,
  deleteAttachment,
  updateAttachment,
  updateCover,
  addLabelToCard,
  removeLabelFromCard,
};
