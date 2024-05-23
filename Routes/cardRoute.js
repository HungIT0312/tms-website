const cardController = require("../Controllers/cardController");
const express = require("express");
const router = express.Router();

router.delete("/:boardId/:listId/:cardId", cardController.deleteById);
router.put(
  "/:boardId/:listId/:cardId/update-cover",
  cardController.updateCover
);
//=========================================================================================
router.put(
  "/:boardId/:listId/:cardId/attachment/:attachmentId",
  cardController.updateAttachment
);
router.delete(
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
router.patch(
  "/:boardId/:listId/:cardId/date-completed",
  cardController.updateDateCompleted
);
//=========================================================================================
router.post(
  "/:boardId/:listId/:cardId/checklist/:checklistId/item",
  cardController.addChecklistItem
);
router.delete(
  "/:boardId/:listId/:cardId/checklist/:checklistId/item/:checklistItemId",
  cardController.deleteChecklistItem
);
router.put(
  "/:boardId/:listId/:cardId/checklist/:checklistId/item/:checklistItemId/text",
  cardController.setChecklistItemText
);
router.put(
  "/:boardId/:listId/:cardId/checklist/:checklistId/item/:checklistItemId/complete",
  cardController.setChecklistItemCompleted
);
router.delete(
  "/:boardId/:listId/:cardId/checklist/:checklistId",
  cardController.deleteChecklist
);
router.post(
  "/:boardId/:listId/:cardId/checklist",
  cardController.createChecklist
);
//=========================================================================================
router.post("/label", cardController.addLabelToCard);

router.delete("/:cardId/label/:labelId", cardController.removeLabelFromCard);
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

router.post("/:boardId/:listId/:cardId/comment", cardController.addComment);
router.put(
  "/:boardId/:listId/:cardId/comment/:commentId",
  cardController.updateComment
);
router.delete(
  "/:boardId/:listId/:cardId/comment/:commentId",
  cardController.deleteComment
);
module.exports = router;
