const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const generateToken = (id, email) => {
  const accessToken = jwt.sign({ id, email }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
  });
  const refreshToken = jwt.sign(
    { id, email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME }
  );
  return { accessToken, refreshToken };
};

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .send({ errMessage: "Authorization token not found!" });
    }
    const header = req.headers.authorization;
    const token = header.split(" ")[1];

    await jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS,
      async (err, verifiedToken) => {
        if (err)
          return res
            .status(401)
            .send({ errMessage: "Authorization token invalid", details: err });
        const user = await userModel.findById(verifiedToken.id);
        req.user = user;
        next();
      }
    );
  } catch (error) {
    return res.status(500).send({
      errMessage: "Internal server error occured!",
      details: error.message,
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
