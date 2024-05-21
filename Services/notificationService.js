const Notification = require("../Models/notificationModal");

const getAllNoticeByUserId = async (userId, callback) => {
  try {
    const notifications = await Notification.find({ user: userId }).populate(
      "user"
    );

    if (!notifications) {
      return callback({ errMessage: "User notifications not found!" });
    }

    return callback(false, notifications);
  } catch (err) {
    return callback({
      errMessage: "Error fetching user notifications",
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
      return callback({ errMessage: "Notifications not found!" });
    }

    return callback(false, updatedNotices);
  } catch (err) {
    return callback({
      errMessage: "Error updating notifications",
      details: err.message,
    });
  }
};

module.exports = { getAllNoticeByUserId, updateNoticeByIds };
