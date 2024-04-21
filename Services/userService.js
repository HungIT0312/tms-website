const userModel = require("../Models/userModel");
const { createRandomHexColor } = require("./helperMethods");
const auth = require("../Middlewares/auth");
const jwt = require("jsonwebtoken");
const register = async (user, callback) => {
  const newUser = userModel({ ...user, color: createRandomHexColor() });
  await newUser
    .save()
    .then((result) => {
      return callback(false, { message: "User created successfully!" });
    })
    .catch((err) => {
      return callback({
        errMessage: "Email already in use!",
        details: err.message,
      });
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


const getAllUsersByIds = async (userIds, callback) => {
  try {
    const users = await userModel.find({ _id: { $in: userIds } });
    return callback(
      false,
      users.map((user) => ({ ...user.toJSON() }))
    );
  } catch (error) {
    return callback({
      errMessage: "Something went wrong while getting users",
      details: error.message,
    });
  }
};

const searchUsers = async (query, callback) => {
  try {
    const users = await userModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    const searchResults = users.map((user) => {
      const { password, __v, ...userData } = user.toJSON();
      return userData;
    });
    return callback(false, searchResults);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong while searching users",
      details: error.message,
    });
  }
};
module.exports = {
  register,
  login,
  getUser,
  refreshToken,
  getAllUsersByIds,
  searchUsers,
};
