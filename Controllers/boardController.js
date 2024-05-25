const boardService = require("../Services/boardService");

const create = async (req, res) => {
  const { title, backgroundImageLink } = req.body;
  if (!(title && backgroundImageLink))
    return res
      .status(400)
      .send({ errMessage: "Tiêu đề và/hoặc hình ảnh không được trống" });
  await boardService.create(req, (err, result) => {
    if (err) return res.status(500).send(err);
    result.__v = undefined;
    return res.status(201).send(result);
  });
};

const getAll = async (req, res) => {
  const userId = req.user._id;
  await boardService.getAll(userId, (err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(result);
  });
};

const getById = async (req, res) => {
  const validate = req.user.boards.filter((board) => board === req.params.id);
  if (!validate)
    return res.status(400).send({
      errMessage:
        "Bạn không thể hiển thị bảng này, bạn không phải là thành viên hoặc chủ sở hữu!",
    });

  await boardService.getById(req.params.id, (err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(result);
  });
};

const getActivityById = async (req, res) => {
  // Validate whether params.id is in the user's boards or not
  const validate = req.user.boards.filter((board) => board === req.params.id);
  if (!validate)
    return res.status(400).send({
      errMessage:
        "Bạn không thể hiển thị bảng này, bạn không phải là thành viên hoặc chủ sở hữu!",
    });
  const { page, limit } = req.query;
  //convert page and limit to number
  req.query.page = Number(page) || 1;
  req.query.limit = Number(limit) || 10;
  // Call the service
  await boardService.getActivityById(
    req.params.boardId,
    req.query.page,
    req.query.limit,
    (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    }
  );
};

const removeMember = async (req, res) => {
  const validate = req.user.boards.filter((board) => board === req.params.id);
  if (!validate)
    return res.status(400).send({
      errMessage: "Bạn không thể xóa thành viên bạn không phải là chủ sở hữu!",
    });
  const { boardId } = req.params;
  const { memberId } = req.body;
  // Call the service
  await boardService.removeMember(
    boardId,
    memberId,
    req.user,
    (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    }
  );
};
const updateBoardProperty = async (req, res) => {
  const { boardId } = req.params;
  const { newValue, property } = req.body;
  // Validate whether params.id is in the user's boards or not
  const validate = req.user.boards.includes(boardId);
  if (!validate) {
    return res.status(400).send({
      errMessage: `Bạn không thể cập nhật, bạn không phải là thành viên hoặc chủ sở hữu!`,
    });
  }

  try {
    await boardService.updateBoardProperty(
      boardId,
      newValue,
      property,
      req.user,
      (err, result) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(result);
      }
    );
  } catch (err) {
    return res.status(400).send({ errMessage: "Bad Request" });
  }
};
const createLabel = async (req, res) => {
  const { boardId } = req.params;
  const label = req.body;
  await boardService.createLabel(boardId, label, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(201).send(result);
  });
};
const updateLabel = async (req, res) => {
  const { labelId } = req.params;
  const label = req.body;
  await boardService.updateLabel(labelId, label, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(201).send(result);
  });
};
const deleteLabel = async (req, res) => {
  const { boardId, labelId } = req.params;
  await boardService.deleteLabel(boardId, labelId, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(201).send(result);
  });
};
const getBoardStats = async (req, res) => {
  const { boardId } = req.params;
  await boardService.getBoardStats(boardId, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(201).send(result);
  });
};
module.exports = {
  create,
  getAll,
  getById,
  getActivityById,
  removeMember,
  updateBoardProperty,
  createLabel,
  deleteLabel,
  updateLabel,
  getBoardStats,
};
