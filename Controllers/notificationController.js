const notificationService = require("../Services/notificationService");
const auth = require("../Middlewares/auth");

//==========================================================================================

const getAllNoticeByUserId = async (req, res) => {
  const user = req.user;
  if (!user)
    return res
      .status(400)
      .send({ errMessage: "Lỗi: Không tìm thấy người dùng!" });

  await notificationService.getAllNoticeByUserId(user._id, (err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(result);
  });
};

//==========================================================================================

const updateNoticeByIds = async (req, res) => {
  //   const noticeId = req.params.id;
  const noticeIds = req.body;

  try {
    await notificationService.updateNoticeByIds(noticeIds, (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(400).send({
      errMessage: "Lỗi cập nhật thông báo",
      details: err.message,
    });
  }
};

//==========================================================================================

module.exports = {
  getAllNoticeByUserId,
  updateNoticeByIds,
};
