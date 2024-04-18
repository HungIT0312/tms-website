const { verifyToken } = require("../Middlewares/auth");
const userModel = require("../Models/userModel");
const { createRandomHexColor } = require("./helperMethods");
const auth = require("../Middlewares/auth");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const register = async (user, callback) => {
  const newUser = userModel({ ...user, color: createRandomHexColor() });
  await newUser
    .save()
    .then((result) => {
      return callback(false, { message: "User created successfuly!" });
    })
    .catch((err) => {
      return callback({ errMessage: "Email already in use!", details: err });
    });
};

const login = async (email, callback) => {
  try {
    let user = await userModel.findOne({ email });
    if (!user) return callback({ errMessage: "Your email/password is wrong!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
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
    if (!user) return callback({ errMessage: "User not found!" });

    const { accessToken, ...newRefreshToken } = auth.generateToken(
      user._id,
      user.email
    );

    return callback(false, { accessToken, ...newRefreshToken });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const getUser = async (id, callback) => {
  try {
    let user = await userModel.findById(id);
    if (!user) return callback({ errMessage: "User not found!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const getUserWithMail = async (email, callback) => {
  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return callback({
        errMessage: "There is no registered user with this e-mail.",
      });
    return callback(false, { ...user.toJSON() });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getUserWithMail,
  refreshToken,
};

// "errMessage": "Authorization token invalid",
// "details": {
//     "name": "TokenExpiredError",
//     "message": "jwt expired",
//     "expiredAt": "2024-04-18T10:22:11.000Z"
// }
