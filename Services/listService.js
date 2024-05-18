const listModel = require("../Models/listModel");
const boardModel = require("../Models/boardModel");
const cardModel = require("../Models/cardModel");

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
    // Get board to check the parent of list is this board
    const board = await boardModel.findById(boardId);
    const list = await listModel.findById(listId.toString()).populate("cards");
    // Validate the parent of the list
    const validate = board.lists.filter((list) => list.id === listId);
    if (!validate)
      return callback({ errMessage: "List or board information are wrong" });

    // Validate whether the owner of the board is the user who sent the request.
    if (!user.boards.filter((board) => board === boardId))
      return callback({
        errMessage:
          "You cannot delete a list that does not hosted by your boards",
      });

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
    return callback(false, { message: "Success", list: list });
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
    const now = new Date();

    // Build the dueDate filter based on the types
    const dueDateFilter = dueDates
      .map((dueDate) => {
        switch (dueDate.type) {
          case "today":
            return {
              "date.dueDate": {
                $gte: new Date(now.setHours(0, 0, 0, 0)),
                $lt: new Date(now.setHours(23, 59, 59, 999)),
              },
            };
          case "overdue":
            return {
              "date.dueDate": { $lt: new Date(now.setHours(0, 0, 0, 0)) },
            };
          case "coming":
            return {
              "date.dueDate": { $gte: new Date(now.setHours(0, 0, 0, 0)) },
            };
          default:
            return {};
        }
      })
      .filter((filter) => Object.keys(filter).length > 0);

    // Build the query object for cards
    const cardQuery = {
      $and: [
        userIds.length > 0 ? { "members.user": { $in: userIds } } : {},
        labelIds.length > 0 ? { labels: { $in: labelIds } } : {},
        ...dueDateFilter,
      ].filter((query) => Object.keys(query).length > 0), // Filter out empty query objects
    };

    // Find lists containing cards that match the query criteria
    let lists = await listModel
      .find({ owner: boardId }) // Filter lists by the boardId
      .populate({
        path: "cards",
        match: cardQuery.$and.length > 0 ? cardQuery : {}, // Apply the card query here only if it has conditions
        populate: [
          {
            path: "activities.user", // Populate user in activities of each card
            model: "user", // Name of the user model
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
};
