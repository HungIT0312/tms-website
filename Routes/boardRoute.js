const express = require("express");
const boardController = require("../Controllers/boardController");
const route = express.Router();

route.post("/:boardId/remove-member", boardController.removeMember);
route.put("/:boardId/update", boardController.updateBoardProperty);
route.post("/create", boardController.create);
route.get("/:id", boardController.getById);
route.get("/:boardId/activity", boardController.getActivityById);
route.get("/", boardController.getAll);
route.post("/:boardId/label", boardController.createLabel);
route.delete("/:boardId/label/:labelId", boardController.deleteLabel);
route.put("/:boardId/label/:labelId", boardController.updateLabel);
route.get("/:boardId/stats", boardController.getBoardStats);
route.post("/:boardId/lock", boardController.updateLockBoard);
route.delete("/:boardId", boardController.deleteBoard);
module.exports = route;
