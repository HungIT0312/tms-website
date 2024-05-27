const cardService = require("../Services/cardService");

const create = async (req, res) => {
  // Deconstruct the params
  const { title, listId, boardId, parentCardId } = req.body;
  const user = req.user;

  // Validate the inputs
  if (!(title && listId && boardId))
    return res.status(400).send({
      errMessage: "Không thể hoàn tất thao tác tạo vì thiếu thông tin",
    });

  //Call the card service
  await cardService.create(
    title,
    listId,
    boardId,
    user,
    parentCardId,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(201).send(result);
    }
  );
};

const deleteById = async (req, res) => {
  // deconstruct the params
  const user = req.user;
  const { boardId, listId, cardId } = req.params;

  // Call the card service
  await cardService.deleteById(cardId, listId, boardId, user, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

const getCard = async (req, res) => {
  const user = req.user;
  const { cardId } = req.params;

  await cardService.getCard(cardId, user, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

const update = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId } = req.params;

  // Call the card service
  await cardService.update(
    cardId,
    listId,
    boardId,
    user,
    req.body,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const addComment = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId } = req.params;

  // Call the card service
  await cardService.addComment(
    cardId,
    listId,
    boardId,
    user,
    req.body,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const updateComment = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId, commentId } = req.params;

  // Call the card service
  await cardService.updateComment(
    cardId,
    listId,
    boardId,
    commentId,
    user,
    req.body,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const deleteComment = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId, commentId } = req.params;

  // Call the card service
  await cardService.deleteComment(
    cardId,
    listId,
    boardId,
    commentId,
    user,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const changeCardMember = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId } = req.params;
  const { memberId } = req.body;
  // Call the card service
  await cardService.changeCardMember(
    cardId,
    listId,
    boardId,
    user,
    memberId,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const updateStartDueDates = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId } = req.params;
  const { startDate, dueDate, dueTime, completed } = req.body;
  // Call the card service
  await cardService.updateStartDueDates(
    cardId,
    listId,
    boardId,
    user,
    startDate,
    dueDate,
    dueTime,
    completed,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const updateDateCompleted = async (req, res) => {
  const user = req.user;
  const { boardId, listId, cardId } = req.params;
  const completed = req.body;
  await cardService.updateDateCompleted(
    cardId,
    listId,
    boardId,
    user,
    completed,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const addAttachment = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId } = req.params;
  const { link, name } = req.body;

  // Call the card service
  await cardService.addAttachment(
    cardId,
    listId,
    boardId,
    user,
    link,
    name,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const deleteAttachment = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId, attachmentId } = req.params;

  // Call the card service
  await cardService.deleteAttachment(
    cardId,
    listId,
    boardId,
    user,
    attachmentId,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};

const updateCover = async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, listId, cardId } = req.params;
  const { color, isSizeOne } = req.body;

  // Call the card service
  await cardService.updateCover(
    cardId,
    listId,
    boardId,
    user,
    color,
    isSizeOne,
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(result);
    }
  );
};
const addLabelToCard = async (req, res) => {
  const { cardId, labelData } = req.body;

  await cardService.addLabelToCard(cardId, labelData, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(result);
  });
};
const removeLabelFromCard = async (req, res) => {
  const { cardId, labelId } = req.params;
  await cardService.removeLabelFromCard(cardId, labelId, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(result);
  });
};
const getActivitiesById = async (req, res) => {
  const { cardId, type } = req.params;

  await cardService.getActivitiesById(cardId, type, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(result);
  });
};
module.exports = {
  create,
  deleteById,
  getCard,
  update,
  addComment,
  updateComment,
  deleteComment,
  updateStartDueDates,
  updateDateCompleted,
  addAttachment,
  deleteAttachment,
  updateCover,
  addLabelToCard,
  removeLabelFromCard,
  changeCardMember,
  getActivitiesById,
};
