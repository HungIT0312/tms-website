const userModel = require("../Models/userModel");
const dotenv = require("dotenv");
const { createRandomHexColor } = require("./helperMethods");
const auth = require("../Middlewares/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const emailHTML = require("../utils/mailHTML");
const boardModel = require("../Models/boardModel");
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
      subject: "Email Verification",
      text: `Please click this button to verify your email.`,
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
          fullName: { $concat: ["$name", " ", "$surname"] },
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

module.exports = {
  login,
  getUser,
  refreshToken,
  getAllUsersByIds,
  searchUsers,
  registerByEmail,
  verifyEmail,
  getUserActivities,
};
