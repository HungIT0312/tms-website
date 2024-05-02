import http from "../../helpers/http";

// Lấy tất cả các danh sách
// export const getAllLists = async (boardId) => {
//   return http.get(`/list/${boardId}`);
// };

// // Tạo một danh sách mới
// export const createList = async (listData) => {
//   return http.post(`/list/create`, listData);
// };

// // Xóa một danh sách
// export const deleteList = async (boardId, listId) => {
//   return http.delete(`/list/${boardId}/${listId}`);
// };

// // Cập nhật tiêu đề của một danh sách
// export const updateListTitle = async (boardId, listId, newTitle) => {
//   return http.put(`/list/${boardId}/${listId}/update-title`, {
//     title: newTitle,
//   });
// };

// // Cập nhật thứ tự của các thẻ trong một danh sách
// export const updateCardOrder = async (cardOrderData) => {
//   return http.post(`/list/change-card-order`, cardOrderData);
// };

// // Cập nhật thứ tự của các danh sách
// export const updateListOrder = async (listOrderData) => {
//   return http.post(`/list/change-list-order`, listOrderData);
// };

// router.delete('/:boardId/:listId/:cardId/delete-card', cardController.deleteById);
// router.put('/:boardId/:listId/:cardId/update-cover', cardController.updateCover);
// router.put('/:boardId/:listId/:cardId/:attachmentId/update-attachment', cardController.updateAttachment);
// router.delete('/:boardId/:listId/:cardId/:attachmentId/delete-attachment', cardController.deleteAttachment);
// router.post('/:boardId/:listId/:cardId/add-attachment', cardController.addAttachment);
// router.put('/:boardId/:listId/:cardId/update-dates', cardController.updateStartDueDates);
// router.put('/:boardId/:listId/:cardId/update-date-completed', cardController.updateDateCompleted);
// router.delete('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/delete-checklist-item', cardController.deleteChecklistItem);
// router.put('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-text', cardController.setChecklistItemText);
// router.put('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-completed', cardController.setChecklistItemCompleted);
// router.post('/:boardId/:listId/:cardId/:checklistId/add-checklist-item', cardController.addChecklistItem);
// router.delete('/:boardId/:listId/:cardId/:checklistId/delete-checklist', cardController.deleteChecklist);
// router.post('/:boardId/:listId/:cardId/create-checklist', cardController.createChecklist);
// router.put('/:boardId/:listId/:cardId/:labelId/update-label-selection', cardController.updateLabelSelection);
// router.delete('/:boardId/:listId/:cardId/:labelId/delete-label', cardController.deleteLabel);
// router.put('/:boardId/:listId/:cardId/:labelId/update-label', cardController.updateLabel);
// router.post('/:boardId/:listId/:cardId/create-label', cardController.createLabel);
// router.post('/:boardId/:listId/:cardId/add-member', cardController.addMember);
// router.delete('/:boardId/:listId/:cardId/:memberId/delete-member', cardController.deleteMember);
// router.post('/create', cardController.create);
// router.get('/:boardId/:listId/:cardId', cardController.getCard);
// router.put('/:boardId/:listId/:cardId', cardController.update);
// router.post('/:boardId/:listId/:cardId/add-comment', cardController.addComment);
// router.put('/:boardId/:listId/:cardId/:commentId', cardController.updateComment);
// router.delete('/:boardId/:listId/:cardId/:commentId', cardController.deleteComment);
