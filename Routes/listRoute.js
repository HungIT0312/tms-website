const express = require("express");
const router = express.Router();
const listController = require("../Controllers/listController");

router.put("/:boardId/:listId", listController.updateList);
router.post("/create", listController.create);
router.get("/:id", listController.getAll);
router.delete("/:boardId/:listId", listController.deleteById);
router.post("/change-card-order", listController.updateCardOrder);
router.post("/update-list-order", listController.changeListOrder);

module.exports = router;
