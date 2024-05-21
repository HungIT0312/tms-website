const listService = require("../Services/listService");

const create = async (req, res) => {
  const { title, boardId } = req.body;
  if (!(title && boardId))
    return res.status(400).send({ errMessage: "Title cannot be empty" });

  // Validate whether boardId is in the user's boards or not
  const validate = req.user.boards.filter((board) => board === boardId);
  if (!validate)
    return res.status(400).send({
      errMessage:
        "You can not add a list to the board, you are not a member or owner!",
    });

  await listService.create(
    { title: title, owner: boardId },
    req.user,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(201).send(result);
    }
  );
};

const getAll = async (req, res) => {
  // Assing parameter to constant
  const boardId = req.params.id;

  // Validate whether boardId is in the user's board or not

  const validate = req.user.boards.filter((board) => board === boardId);
  if (!validate)
    return res.status(400).send({
      errMessage:
        "You cannot get lists, because you are not owner of this lists!",
    });

  // Call the service to get all lists whose owner id matches the boardId
  await listService.getAll(boardId, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

const deleteById = async (req, res) => {
  // deconstruct the params
  const { listId, boardId } = req.params;
  const user = req.user;

  // Validate the listId and boardId
  if (!(listId && boardId))
    return res.status(400).send({ errMessage: "List or board undefined" });

  await listService.deleteById(listId, boardId, user, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

const updateCardOrder = async (req, res) => {
  // deconstruct the params
  const { boardId, sourceId, destinationId, destinationIndex, cardId } =
    req.body;
  const user = req.user;

  // Validate the params
  if (!(boardId && sourceId && destinationId && cardId))
    return res.status(400).send({ errMessage: "All parameters not provided" });

  // Validate the owner of board
  const validate = user.boards.filter((board) => board === boardId);
  if (!validate)
    return res
      .status(403)
      .send({ errMessage: "You cannot edit the board that you hasnt" });

  // Call the service
  await listService.updateCardOrder(
    boardId,
    sourceId,
    destinationId,
    destinationIndex,
    cardId,
    user,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};
const updateList = async (req, res) => {
  // deconstruct the params
  const { listId, boardId } = req.params;
  const user = req.user;
  const { value, property } = req.body;

  // Validate the listId and boardId
  if (!(listId && boardId))
    return res.status(400).send({ errMessage: "List or board undefined" });

  await listService.updateList(
    listId,
    boardId,
    user,
    value,
    property,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};
const changeListOrder = async (req, res) => {
  // deconstruct the params
  const { boardId, listIds } = req.body;
  const user = req.user;

  if (!(boardId && listIds))
    return res.status(400).send({ errMessage: "All parameters not provided" });

  const validate = user.boards.filter((board) => board === boardId);
  if (!validate)
    return res
      .status(403)
      .send({ errMessage: "You cannot edit the board that you hasnt" });

  await listService.changeListOrder(boardId, listIds, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

const getAllListByFilter = async (req, res) => {
  try {
    // Extract parameters from the request body
    const { boardId } = req.params;
    const { users, labels, dueDates } = req.body;

    // Extract user IDs from the users array
    const userIds = users.map((user) => user.user);

    // Extract label IDs from the labels array
    const labelIds = labels.map((label) => label._id);

    // Validate whether boardId is in the user's boards or not
    const isValidBoard = req.user.boards.some(
      (board) => board.toString() === boardId
    );
    if (!isValidBoard) {
      return res.status(400).send({
        errMessage:
          "You cannot get lists because you are not the owner of this board!",
      });
    }

    // Call the service to get all lists that match the filter criteria
    await listService.getAllListByFilter(
      boardId,
      userIds,
      labelIds,
      dueDates,
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      }
    );
  } catch (error) {
    return res.status(500).send({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};
const changeCardToAnotherList = async (req, res) => {
  const { boardId, listId } = req.params;
  const { newListId, cardId } = req.body;
  const user = req.user;

  await listService.changeCardToAnotherList(
    listId,
    boardId,
    user,
    newListId,
    cardId,
    (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    }
  );
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
