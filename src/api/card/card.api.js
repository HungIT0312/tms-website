import http from "../../helpers/http";

// // Tạo một danh sách mới
export const createCard = async (data) => {
  return http.post(`/card/create`, data);
};

// // Cập nhật tiêu đề của một card
export const updateCard = async (boardId, listId, cardId, updateObj) => {
  return http.put(`/card/${boardId}/${listId}/${cardId}`, updateObj);
};
//==================================================================================
export const updateLabel = async (boardId, listId, cardId, labelId, label) => {
  return http.put(
    `/card/${boardId}/${listId}/${cardId}/label/${labelId}`,
    label
  );
};
export const deleteLabel = async (boardId, listId, cardId, labelId) => {
  return http.delete(`/card/${boardId}/${listId}/${cardId}/label/${labelId}`);
};
export const createLabel = async (boardId, listId, cardId, label) => {
  return http.post(`/card/${boardId}/${listId}/${cardId}/label`, label);
};
//==================================================================================

// export const updateCard = async (boardId, listId, cardId, updateObj) => {
//   return http.put(`/card/${boardId}/${listId}/${cardId}`, updateObj);
// };
// export const updateCard = async (boardId, listId, cardId, updateObj) => {
//   return http.put(`/card/${boardId}/${listId}/${cardId}`, updateObj);
// };
// // Cập nhật thứ tự của các thẻ trong một danh sách
// export const updateCardOrder = async (cardOrderData) => {
//   return http.post(`/list/change-card-order`, cardOrderData);
// };

// // Cập nhật thứ tự của các danh sách
// export const updateListOrder = async (listOrderData) => {
//   return http.post(`/list/change-list-order`, listOrderData);
// };

// router.put(
//   "/:boardId/:listId/:cardId/label/:labelId/update-label-selection",
//   cardController.updateLabelSelection
// );

// router.post("/:boardId/:listId/:cardId/label", cardController.createLabel);
