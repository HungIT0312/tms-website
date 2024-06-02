const listModel = require("../Models/listModel");
const boardModel = require("../Models/boardModel");
const cardModel = require("../Models/cardModel");
const dayjs = require("dayjs");
const weekday = require("dayjs/plugin/weekday");
const localeData = require("dayjs/plugin/localeData");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(localeData);
const transformUser = (doc, ret) => {
  delete ret.password;
  delete ret.verificationToken;
  delete ret.verified;
  delete ret.__v;
  delete ret.boards;
  return ret;
};
const create = async (model, user, callback) => {
  try {
    const tempList = await listModel(model);
    const newList = await tempList.save();
    const ownerBoard = await boardModel.findById(model.owner);
    ownerBoard.lists.push(newList.id);

    ownerBoard.activity.unshift({
      user: user._id,
      action: `đã thêm danh sách "${newList.title}" vào bảng này`,
    });
    ownerBoard.save();
    return callback(false, newList);
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const getAll = async (boardId, callback) => {
  try {
    let lists = await listModel
      .find({ owner: { $in: boardId } })
      .populate({
        path: "cards",
        populate: [
          {
            path: "labels", // Populate labels
            model: "label",
          },
          {
            path: "members.user", // Populate user
            model: "user",
            select: "-password -verificationToken -verified -__v -boards",
          },
        ],
      })
      .exec();

    const board = await boardModel.findById(boardId);
    let responseObject = board.lists.map((listId) => {
      return lists.filter(
        (listObject) => listObject._id.toString() === listId.toString()
      )[0];
    });

    return callback(false, responseObject);
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const deleteById = async (listId, boardId, user, callback) => {
  try {
    const board = await boardModel.findById(boardId);

    const validate = board.lists.filter(
      (list) => list.toString() === listId.toString()
    );
    if (!validate)
      return callback({ errMessage: "Thông tin của danh sách hoặc bảng sai" });

    if (!user.boards.filter((board) => board === boardId))
      return callback({
        errMessage:
          "Bạn không thể xóa danh sách không được lưu trữ trên bảng của bạn",
      });

    const result = await listModel.findByIdAndDelete(listId);

    board.lists = board.lists.filter((list) => list.toString() !== listId);

    board.activity.unshift({
      user: user._id,
      action: `đã xóa danh sách "${result.title}"  khỏi bảng`,
    });
    board.save();

    await cardModel.deleteMany({ owner: listId });

    return callback(false, {
      message: "Xóa thành công!",
      list: result,
    });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const updateCardOrder = async (
  boardId,
  sourceId,
  destinationId,
  destinationIndex,
  cardId,
  user,
  callback
) => {
  try {
    // Validate the parent board of the lists
    const board = await boardModel.findById(boardId);
    let validate = board.lists.filter((list) => list.id === sourceId);
    const validate2 = board.lists.filter((list) => list.id === destinationId);
    if (!validate || !validate2)
      return callback({ errMessage: "Thông tin của danh sách hoặc bảng sai" });

    // Validate the parent list of the card
    const sourceList = await listModel.findById(sourceId);
    validate = sourceList.cards.filter(
      (card) => card._id.toString() === cardId
    );
    if (!validate)
      return callback({ errMessage: "Thông tin của danh sách hoặc thẻ sai" });

    // Remove the card from source list and save
    sourceList.cards = sourceList.cards.filter(
      (card) => card._id.toString() !== cardId
    );
    await sourceList.save();

    // Insert the card to destination list and save
    const card = await cardModel.findById(cardId);
    const destinationList = await listModel.findById(destinationId);
    const temp = Array.from(destinationList.cards);
    temp.splice(destinationIndex, 0, cardId);
    destinationList.cards = temp;
    await destinationList.save();

    // Add card activity
    if (sourceId !== destinationId)
      card.activities.unshift({
        text: `di chuyển thẻ này từ ${sourceList.title} tới ${destinationList.title}`,
        userName: user.name,
        color: user.color,
      });

    // Change owner board of card
    card.owner = destinationId;
    await card.save();

    return callback(false, { message: "Thành công" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const updateList = async (listId, boardId, user, value, property, callback) => {
  try {
    const board = await boardModel.findById(boardId);
    const list = await listModel.findById(listId);

    const validate = board.lists.filter((list) => list._id === listId);
    if (!validate) {
      return callback({
        errMessage: "Thông tin của danh sách hoặc bảng sai",
      });
    }

    // Kiểm tra xem người gửi yêu cầu có phải là chủ sở hữu của bảng không
    if (!user.boards.includes(boardId.toString())) {
      return callback({
        errMessage:
          "Bạn không thể xóa danh sách không được lưu trữ trên bảng của bạn",
      });
    }

    list[property] = value;
    if (property === "_destroy") {
      await Promise.all(
        list.cards.map(async (card) => {
          await cardModel.findByIdAndUpdate(card._id, {
            $set: { _destroy: value },
          });
        })
      );
    }

    await list.save();
    const newlist = await listModel
      .findById(listId)
      .populate({
        path: "cards",
        populate: [
          {
            path: "activities.user",
            model: "user",
          },
          {
            path: "labels",
            model: "label",
          },
          {
            path: "members.user",
            model: "user",
          },
        ],
      })
      .exec();
    return callback(false, { message: "Thành công", list: newlist });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};
const changeCardToAnotherList = async (
  listId,
  boardId,
  user,
  newListId,
  cardId,
  callback
) => {
  try {
    const board = await boardModel.findById(boardId);
    const oldList = await listModel.findById(listId);
    const newList = await listModel.findById(newListId);
    const card = await cardModel.findById(cardId);

    const validateOldList = board.lists.some(
      (list) => list.toString() === listId
    );
    if (!validateOldList) {
      return callback({
        errMessage: "Thông tin của danh sách hoặc bảng sai",
      });
    }
    const validateNewList = board.lists.some(
      (list) => list.toString() === newListId
    );
    if (!validateNewList) {
      return callback({
        errMessage: "Danh sách mới không thuộc về bảng này",
      });
    }

    if (!user.boards.includes(boardId.toString())) {
      return callback({
        errMessage:
          "Bạn không thể thay đổi thẻ của danh sách không được quản lý bởi bảng của bạn",
      });
    }

    const cardIndex = oldList.cards.findIndex(
      (card) => card.toString() === cardId
    );
    if (cardIndex === -1) {
      return callback({
        errMessage: "Thẻ không thuộc danh sách cũ",
      });
    }

    oldList.cards.splice(cardIndex, 1);
    newList.cards.push(cardId);
    card.owner = newList._id;
    // Save the old and new lists
    await Promise.all([oldList.save(), newList.save(), card.save()]);

    return callback(false, { message: "Thành công" });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const changeListOrder = async (boardId, listIds, callback) => {
  try {
    const board = await boardModel.findById(boardId);

    // if (board.lists.length !== listIds.length)
    //   return callback({
    //     errMessage: "Number of lists in request does not match with the board",
    //   });

    board.lists = listIds;
    await board.save();

    return callback(false, { message: "Thành công", lists: board.lists });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};
const getAllListByFilter = async (
  boardId,
  userIds,
  labelIds,
  dueDates,
  completed,
  callback
) => {
  try {
    const now = dayjs();

    // Combine all due date filters using $or
    const dueDateFilter = {
      $or: dueDates
        .map((dueDate) => {
          switch (dueDate.type) {
            case "today":
              return {
                "date.dueDate": {
                  $gte: now.startOf("day").toDate(),
                  $lt: now.endOf("day").toDate(),
                },
              };
            case "overdue":
              return {
                "date.completed": { $eq: false },
                "date.dueDate": { $lte: now.subtract(1, "day").toDate() },
              };
            case "coming":
              return {
                "date.dueDate": { $gt: now.toDate() },
              };
            case "nodue":
              return {
                "date.dueDate": { $exists: false },
              };
            default:
              return {};
          }
        })
        .filter((filter) => Object.keys(filter).length > 0),
    };

    // Build user filter
    const userFilter = userIds.includes("unassign")
      ? {
          $or: [
            { "members.user": { $exists: false } },
            {
              "members.user": {
                $in: userIds.filter((id) => id !== "unassign"),
              },
            },
          ],
        }
      : userIds.length > 0
      ? { "members.user": { $in: userIds } }
      : {};
    const completedFilter =
      completed !== undefined ? { "date.completed": completed } : {};
    // Build the complete card query
    const cardQuery = {
      $and: [
        userFilter,
        labelIds.length > 0 ? { labels: { $in: labelIds } } : {},
        dueDateFilter.$or.length > 0 ? dueDateFilter : {},
        completedFilter,
      ].filter((query) => Object.keys(query).length > 0),
    };

    // Query the lists
    let lists = await listModel
      .find({ owner: boardId })
      .populate({
        path: "cards",
        match: cardQuery.$and.length > 0 ? cardQuery : {},
        populate: [
          {
            path: "activities.user",
            model: "user",
            select: "-password -verificationToken -verified -__v -boards",
          },
          {
            path: "labels",
            model: "label",
          },
          {
            path: "members.user",
            model: "user",
            select: "-password -verificationToken -verified -__v -boards",
          },
        ],
      })
      .exec();
    lists = lists.map((list) => {
      list.cards = list.cards.map((card) => {
        card.activities = card.activities.map((activity) => {
          if (activity.user) {
            const activityObj = activity.toObject();
            delete activityObj.user.password;
            delete activityObj.user.verificationToken;
            delete activityObj.user.verified;
            delete activityObj.user.__v;
            delete activityObj.user.boards;
            return activityObj;
          }
          return activity;
        });
        return card;
      });
      return list;
    });
    return callback(false, lists);
  } catch (error) {
    return callback({
      errMessage: "Xảy ra lỗi",
      details: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  deleteById,
  updateCardOrder,
  changeListOrder,
  updateList,
  getAllListByFilter,
  changeCardToAnotherList,
};
