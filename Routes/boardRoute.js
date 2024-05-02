const express = require("express");
const boardController = require("../Controllers/boardController");
const route = express.Router();

route.post("/:boardId/remove-member", boardController.removeMember);
route.put("/:boardId/update", boardController.updateBoardProperty);
route.post("/create", boardController.create);
route.get("/:id", boardController.getById);
route.get("/:boardId/activity", boardController.getActivityById);
route.get("/", boardController.getAll);

module.exports = route;
