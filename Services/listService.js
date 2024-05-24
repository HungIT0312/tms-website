const listModel = require("../Models/listModel");
const boardModel = require("../Models/boardModel");
const cardModel = require("../Models/cardModel");
const dayjs = require("dayjs");

const create = async (model, user, callback) => {
  try {
    // Create new List

    const tempList = await listModel(model);

    // Save the new List
    const newList = await tempList.save();

    // Get owner board
    const ownerBoard = await boardModel.findById(model.owner);

    // Add newList's id to owner board
    ownerBoard.lists.push(newList.id);

    // Add created activity to owner board activities
    ownerBoard.activity.unshift({
      user: user._id,
      action: `added ${newList.title} to this board`,
    });

    // Save changes
    ownerBoard.save();

    // Return new list
    return callback(false, newList);
  } catch (error) {
    // Return error message
    return callback({
      errMessage: "Something went wrong",
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
            path: "activities.user", // Populate user trong activities của mỗi card
            model: "user", // Tên của modal user
          },
          {
            path: "labels", // Populate labels
            model: "label",
          },
          {
            path: "members.user", // Populate user
            model: "user",
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
      errMessage: "Something went wrong",
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
      return callback({ errMessage: "List or board information are wrong" });

    if (!user.boards.filter((board) => board === boardId))
      return callback({
        errMessage:
          "You cannot delete a list that does not hosted by your boards",
      });

    const result = await listModel.findByIdAndDelete(listId);

    board.lists = board.lists.filter((list) => list.toString() !== listId);

    board.activity.unshift({
      user: user._id,
      action: `deleted list "${result.title}"  from this board`,
    });
    board.save();

    await cardModel.deleteMany({ owner: listId });

    return callback(false, {
      message: "Delete list successfully!",
      list: result,
    });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
      return callback({ errMessage: "List or board information are wrong" });

    // Validate the parent list of the card
    const sourceList = await listModel.findById(sourceId);
    validate = sourceList.cards.filter(
      (card) => card._id.toString() === cardId
    );
    if (!validate)
      return callback({ errMessage: "List or card information are wrong" });

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
        text: `moved this card from ${sourceList.title} to ${destinationList.title}`,
        userName: user.name,
        color: user.color,
      });

    // Change owner board of card
    card.owner = destinationId;
    await card.save();

    return callback(false, { message: "Success" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
        errMessage: "List or board information are wrong",
      });
    }

    // Kiểm tra xem người gửi yêu cầu có phải là chủ sở hữu của bảng không
    if (!user.boards.includes(boardId.toString())) {
      return callback({
        errMessage:
          "You cannot delete a list that does not hosted by your boards",
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
    return callback(false, { message: "Success", list: newlist });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
        errMessage: "List or board information are wrong",
      });
    }
    const validateNewList = board.lists.some(
      (list) => list.toString() === newListId
    );
    if (!validateNewList) {
      return callback({
        errMessage: "New list does not belong to this board",
      });
    }

    if (!user.boards.includes(boardId.toString())) {
      return callback({
        errMessage:
          "You cannot change a card of a list not hosted by your boards",
      });
    }

    const cardIndex = oldList.cards.findIndex(
      (card) => card.toString() === cardId
    );
    if (cardIndex === -1) {
      return callback({
        errMessage: "Card does not belong to the old list",
      });
    }

    oldList.cards.splice(cardIndex, 1);
    newList.cards.push(cardId);
    card.owner = newList._id;
    // Save the old and new lists
    await Promise.all([oldList.save(), newList.save(), card.save()]);

    return callback(false, { message: "Success" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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

    return callback(false, { message: "Success", lists: board.lists });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};
const getAllListByFilter = async (
  boardId,
  userIds,
  labelIds,
  dueDates,
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
                "date.dueDate": { $lt: now.toDate() },
                "date.completed": false,
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

    // Build the complete card query
    const cardQuery = {
      $and: [
        userFilter,
        labelIds.length > 0 ? { labels: { $in: labelIds } } : {},
        dueDateFilter.$or.length > 0 ? dueDateFilter : {},
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

    return callback(false, lists);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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
