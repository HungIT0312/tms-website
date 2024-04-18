const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/get-user", userController.getUser);
router.post("/get-user-with-email", userController.getUserWithMail);
router.post("/refresh-token", userController.refreshToken);
module.exports = router;