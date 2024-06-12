const userModel = require("../Models/userModel");
const dotenv = require("dotenv");
const { createRandomHexColor } = require("./helperMethods");
const auth = require("../Middlewares/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const emailHTML = require("../utils/mailHTML");
const boardModel = require("../Models/boardModel");
const cardModel = require("../Models/cardModel");
const dayjs = require("dayjs");
const listModel = require("../Models/listModel");
const emailReset = require("../utils/mailReset");
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SERVER_EMAIL,
    pass: process.env.SERVER_EMAIL_PASS,
  },
});

const registerByEmail = async (user, currentURL, callback) => {
  try {
    const verificationToken = jwt.sign(
      { email: user.email },
      process.env.EMAIL_VERIFICATION_SECRET
    );

    const mailOptions = {
      from: process.env.SERVER_EMAIL,
      to: user.email,
      subject: "Email xác thực",
      text: `Vui lòng nhấp vào nút này để xác minh email của bạn.`,
      html: emailHTML(currentURL, verificationToken),
    };
    const newUser = new userModel({
      ...user,
      color: createRandomHexColor(),
      verificationToken,
    });
    await newUser
      .save()
      .then((result) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return callback({
              errMessage: "Không gửi được email xác minh",
              details: error,
            });
          } else {
            return callback(false, {
              message:
                "Người dùng đã được tạo thành công! Vui lòng kiểm tra email của bạn để xác minh.",
            });
          }
        });
      })
      .catch((err) => {
        return callback({
          errMessage: "Email đã được sử dụng!",
          details: err.message,
        });
      });
  } catch (err) {
    return callback({
      errMessage: "Không thể đăng ký người dùng",
      details: err.message,
    });
  }
};
const verifyEmail = async (verificationToken, callback) => {
  try {
    const decoded = jwt.verify(
      verificationToken,
      process.env.EMAIL_VERIFICATION_SECRET
    );
    const user = await userModel.findOne({
      email: decoded.email,
      verificationToken,
    });
    if (!user)
      return callback({ errMessage: "Mã thông báo xác minh không hợp lệ" });

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    return callback(false, {
      message: "Email đã được xác minh thành công!",
      verified: true,
    });
  } catch (err) {
    return callback({
      errMessage: "Không thể xác minh email",
      details: err.message,
    });
  }
};

const login = async (email, callback) => {
  try {
    let user = await userModel.findOne({ email });
    if (!user) return callback({ errMessage: "Sai email hoặc mật khẩu!" });
    // if (!user.verified)
    //   return callback({
    //     errMessage: "Please check your email for a verification mail!",
    //     details: err.message,
    //     redirectLink: "/auth/verify-mail",
    //   });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: err.message,
    });
  }
};
const verifyToken1 = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
const refreshToken = async (refreshToken, callback) => {
  try {
    const decoded = await verifyToken1(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await userModel.findById(decoded.id);
    if (!user) return callback({ errMessage: "Không tìm thấy người dùng!" });

    const { accessToken, ...newRefreshToken } = auth.generateToken(
      user._id,
      user.email
    );

    return callback(false, { accessToken, ...newRefreshToken });
  } catch (err) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: err.message,
    });
  }
};

const getUser = async (id, callback) => {
  try {
    let user = await userModel.findById(id);
    if (!user) return callback({ errMessage: "Không tìm thấy người dùng!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: err.message,
    });
  }
};

const getAllUsersByIds = async (userIds, callback) => {
  try {
    const users = await userModel.find({ _id: { $in: userIds } });
    return callback(
      false,
      users.map((user) => ({ ...user.toJSON() }))
    );
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra khi lấy thông tin",
      details: error.message,
    });
  }
};

const searchUsers = async (query, callback) => {
  try {
    const users = await userModel.aggregate([
      {
        $project: {
          fullName: { $concat: ["$surname", " ", "$name"] },
          name: 1,
          surname: 1,
          email: 1,
          avatar: 1,
          color: 1,
          boards: 1,
          invitations: 1,
          _destroy: 1,
          verified: 1,
          verificationToken: 1,
        },
      },
      {
        $match: {
          $or: [
            { fullName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      },
    ]);

    const searchResults = users.map((user) => {
      const { password, __v, ...userData } = user;
      return userData;
    });

    return callback(false, searchResults);
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra khi lấy thông tin",
      details: error.message,
    });
  }
};

const getUserActivities = async (userId, callback) => {
  try {
    const activities = await boardModel.aggregate([
      {
        $unwind: "$activity", // Phân rã mảng activity
      },
      {
        $lookup: {
          from: "users", // Collection chứa thông tin người dùng
          localField: "activity.user", // Trường trong bảng board
          foreignField: "_id", // Trường trong collection users
          as: "userDetails", // Tên của trường chứa thông tin chi tiết người dùng
        },
      },
      {
        $match: {
          "userDetails._id": mongoose.Types.ObjectId(userId), // Lọc hoạt động của người dùng cụ thể
        },
      },
      {
        $project: {
          _id: 1,
          user: "$userDetails",
          action: "$activity.action",
          edited: "$activity.edited",
          cardTitle: "$activity.cardTitle",
          actionType: "$activity.actionType",
          date: "$activity.date",
        },
      },
    ]);

    return callback(false, activities);
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra khi lấy thông tin hoạt động",
      details: error.message,
    });
  }
};

const updateUserPassword = async (userId, newPassword, callback) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return callback({ errMessage: "Không tìm thấy người dùng!" });

    user.password = newPassword;
    await user.save();

    return callback(false, {
      message: "Mật khẩu đã được cập nhật thành công!",
    });
  } catch (err) {
    return callback({
      errMessage: "Không thể cập nhật mật khẩu",
      details: err.message,
    });
  }
};
const updateUserBasicInfo = async (userId, basicInfo, callback) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return callback({ errMessage: "Không tìm thấy người dùng!" });

    Object.assign(user, basicInfo);
    await user.save();

    return callback(false, {
      message: "Thông tin cơ bản đã được cập nhật thành công!",
    });
  } catch (err) {
    return callback({
      errMessage: "Không thể cập nhật thông tin cơ bản",
      details: err.message,
    });
  }
};
const userStats = async (userId, boardId, callback) => {
  try {
    // Tìm tất cả các lists thuộc về bảng
    const lists = await listModel.find({ owner: boardId });

    // Lấy tất cả các thẻ thuộc về các lists này và user là thành viên
    const listIds = lists.map((list) => list._id);
    const cards = await cardModel.find({
      owner: { $in: listIds },
      "members.user": userId,
    });

    const cardDetails = cards.map((card) => {
      const now = dayjs();
      const dueDate = dayjs(card.date.dueDate);
      const resolvedAt = card.date.resolvedAt
        ? dayjs(card.date.resolvedAt)
        : null;

      let dueStatus;
      if (resolvedAt) {
        if (resolvedAt.isAfter(dueDate)) {
          dueStatus = "Quá hạn";
        } else if (resolvedAt.isSame(dueDate, "day")) {
          dueStatus = "Đúng hạn";
        } else {
          dueStatus = `Trước hạn ${dueDate.diff(resolvedAt, "day")} ngày`;
        }
      } else {
        dueStatus = dueDate.isBefore(now) ? "Quá hạn" : "Còn hạn";
      }

      return {
        title: card.title,
        _id: card._id,
        createdAt: card.createdAt,
        dueDate: card.date.dueDate,
        completed: card.date.completed,
        resolvedAt: card.date.resolvedAt,
        dueStatus: dueStatus,
        _destroy: card._destroy,
      };
    });

    return callback(false, {
      totalCards: cards.length,
      cards: cardDetails,
    });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const resetPassword = async (resetToken, newPassword, callback) => {
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET_ACCESS);
    const user = await userModel.findById(decoded.id);
    if (!user || user.resetToken !== resetToken) {
      return callback({
        errMessage: "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
      });
    }

    user.password = newPassword;
    user.resetToken = null;
    await user.save();

    return callback(false, {
      message: "Mật khẩu đã được cập nhật thành công!",
    });
  } catch (err) {
    return callback({
      errMessage: "Không thể cập nhật mật khẩu, vui lòng thử lại sau",
      details: err.message,
    });
  }
};
const forgotPassword = async (email, currentURL, callback) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) return callback({ errMessage: "Email không tồn tại!" });

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: "1h" }
    );

    const resetURL = currentURL;
    const mailOptions = {
      from: process.env.SERVER_EMAIL,
      to: user.email,
      subject: "Đặt lại mật khẩu",
      text: `Ấn vào nút để đặt lại mật khẩu`,
      html: emailReset(resetURL, resetToken),
    };
    user.resetToken = resetToken;
    await user.save();

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return callback({
          errMessage: "Không gửi được email đặt lại mật khẩu",
          details: error,
        });
      } else {
        return callback(false, {
          message:
            "Email đặt lại mật khẩu đã được gửi thành công! Vui lòng kiểm tra email của bạn.",
        });
      }
    });
  } catch (err) {
    return callback({
      errMessage: "Không thể xử lý yêu cầu đặt lại mật khẩu",
      details: err.message,
    });
  }
};
module.exports = {
  login,
  getUser,
  refreshToken,
  getAllUsersByIds,
  searchUsers,
  registerByEmail,
  verifyEmail,
  getUserActivities,
  updateUserPassword,
  updateUserBasicInfo,
  userStats,
  forgotPassword,
  resetPassword,
};
