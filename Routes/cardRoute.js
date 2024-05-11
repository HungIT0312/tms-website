const cardController = require("../Controllers/cardController");
const express = require("express");
const router = express.Router();

router.delete(
  "/:boardId/:listId/:cardId/delete-card",
  cardController.deleteById
);
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
router.put(
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
router.put(
  "/:boardId/:listId/:cardId/label/:labelId/update-label-selection",
  cardController.updateLabelSelection
);
router.delete(
  "/:boardId/:listId/:cardId/label/:labelId",
  cardController.deleteLabel
);
router.put(
  "/:boardId/:listId/:cardId/label/:labelId",
  cardController.updateLabel
);
router.post("/:boardId/:listId/:cardId/label", cardController.createLabel);
//=========================================================================================

router.post("/:boardId/:listId/:cardId/add-member", cardController.addMember);
router.delete(
  "/:boardId/:listId/:cardId/:memberId/delete-member",
  cardController.deleteMember
);
//=========================================================================================
router.post("/create", cardController.create);
router.get("/:boardId/:listId/:cardId", cardController.getCard);
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
