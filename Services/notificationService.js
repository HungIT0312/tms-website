const Notification = require("../Models/notificationModal");

const getAllNoticeByUserId = async (userId, callback) => {
  try {
    const notifications = await Notification.find({ user: userId }).populate(
      "user"
    );

    if (!notifications) {
      return callback({
        errMessage: "Không tìm thấy thông báo của người dùng!",
      });
    }

    return callback(false, notifications);
  } catch (err) {
    return callback({
      errMessage: "Lỗi tìm nạp thông báo của người dùng",
      details: err.message,
    });
  }
};

const updateNoticeByIds = async (noticeIds, callback) => {
  try {
    const filter = { _id: { $in: noticeIds } };
    const update = { read: true };

    const updatedNotices = await Notification.updateMany(filter, update);

    if (!updatedNotices) {
      return callback({ errMessage: "Thông báo không tìm thấy!" });
    }

    return callback(false, updatedNotices);
  } catch (err) {
    return callback({
      errMessage: "Lỗi cập nhật thông báo",
      details: err.message,
    });
  }
};

module.exports = { getAllNoticeByUserId, updateNoticeByIds };
