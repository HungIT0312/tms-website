const cardController = require("../Controllers/cardController");
const express = require("express");
const router = express.Router();

router.delete("/:boardId/:listId/:cardId", cardController.deleteById);
router.put(
  "/:boardId/:listId/:cardId/update-cover",
  cardController.updateCover
);
//=========================================================================================

router.post(
  "/:boardId/:listId/:cardId/attachment/:attachmentId",
  cardController.deleteAttachment
);
router.post(
  "/:boardId/:listId/:cardId/attachment",
  cardController.addAttachment
);
//=========================================================================================
router.put(
  "/:boardId/:listId/:cardId/dates",
  cardController.updateStartDueDates
);

//=========================================================================================
router.post("/label", cardController.addLabelToCard);

router.post("/:cardId/label/:labelId", cardController.removeLabelFromCard);
//=========================================================================================

router.patch(
  "/:boardId/:listId/:cardId/member",
  cardController.changeCardMember
);

//=========================================================================================
router.post("/create", cardController.create);
router.get("/:cardId", cardController.getCard);
router.put("/:boardId/:listId/:cardId", cardController.update);
//=========================================================================================

router.post("/:cardId/comment", cardController.addComment);
router.patch("/:cardId/comment/:commentId", cardController.updateComment);
router.post("/:cardId/comment/:commentId", cardController.deleteComment);
//=============================================================
router.get("/:cardId/:type", cardController.getActivitiesById);

module.exports = router;
