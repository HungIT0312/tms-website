const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

router.post("/login", userController.login);
router.get("/get-user", userController.getUser);
router.get("/get-users", userController.getAllUsersByIds);
router.post("/search", userController.searchUsers);
router.post("/refresh-token", userController.refreshToken);
router.post("/register-by-mail", userController.registerByEmail);
router.post("/verify-mail", userController.verifyEmail);
router.patch("/update-user", userController.updateUser);
module.exports = router;
