const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/get-user", userController.getUser);
router.get("/get-users", userController.getAllUsersByIds);
router.post("/search", userController.searchUsers);
router.post("/refresh-token", userController.refreshToken);
module.exports = router;
