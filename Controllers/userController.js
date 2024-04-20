const bcrypt = require("bcryptjs");
const userService = require("../Services/userService");
const auth = require("../Middlewares/auth");

const register = async (req, res) => {
  const { name, surname, email, password } = req.body;
  if (!(name && surname && email && password))
    return res
      .status("400")
      .send({ errMessage: "Please fill all required areas!" });

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  req.body.password = hashedPassword;

  await userService.register(req.body, (err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(201).send(result);
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password))
    return res
      .status(400)
      .send({ errMessage: "Please fill all required areas!" });

  await userService.login(email, (err, result) => {
    if (err) return res.status(400).send(err);

    const hashedPassword = result.password;
    if (!bcrypt.compareSync(password, hashedPassword))
      return res
        .status(400)
        .send({ errMessage: "Your email/password is wrong!" });
    const { accessToken, refreshToken } = auth.generateToken(
      result._id.toString(),
      result.email
    );

    delete result.__v;
    delete result.password;
    return res.status(200).send({
      message: "User login successful!",
      user: result,
      tokens: { accessToken, refreshToken },
    });
  });
};

const refreshToken = async (req, res) => {
  console.log(req.headers.cookie);
  const refreshToken = req.headers.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("refreshToken="))
    .split("=")[1];
  if (!refreshToken) {
    return res.status(400).send({ errMessage: "Refresh token is required!" });
  }

  await userService.refreshToken(refreshToken, (err, result) => {
    if (err) {
      return res.status(401).send(err);
    }
    return res.status(200).send(result);
  });
};

const getUser = async (req, res) => {
  const userId = req.user.id;
  await userService.getUser(userId, (err, result) => {
    if (err) return res.status(404).send(err);

    result.password = undefined;
    result.__v = undefined;
    delete result._v;
    delete result.password;
    return res.status(200).send(result);
  });
};

const getUserWithMail = async (req, res) => {
  const { email } = req.body;
  await userService.getUserWithMail(email, (err, result) => {
    if (err) return res.status(404).send(err);

    const dataTransferObject = {
      name: result.name,
      surname: result.surname,
      color: result.color,
      email: result.email,
    };
    return res.status(200).send(dataTransferObject);
  });
};
const searchUsers = async (req, res) => {
  const query = req.body;
  await userService.searchUsers(query, (err, result) => {
    if (err) return res.status(404).send(err);
    return res.status(200).send(result);
  });
};
const getAllUsersByIds = async (req, res) => {
  const userIds = req.body;
  await userService.getAllUsersByIds(userIds, (err, result) => {
    if (err) return res.status(404).send(err);
    return res.status(200).send(result);
  });
};
module.exports = {
  register,
  login,
  getUser,
  getUserWithMail,
  refreshToken,
  searchUsers,
  getAllUsersByIds,
};
