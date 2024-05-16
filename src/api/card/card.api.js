import http from "../../helpers/http";

export const createCard = (data) => {
  return http.post(`/card/create`, data);
};

export const updateCard = (boardId, listId, cardId, updateObj) => {
  return http.put(`/card/${boardId}/${listId}/${cardId}`, updateObj);
};
//==================================================================================
export const addCardLabel = async (data) => {
  // const { cardId, labelData } = data;
  return http.post(`/card/label`, data);
};
export const removeCardLabel = (data) => {
  const { cardId, labelData } = data;
  return http.delete(`/card/${cardId}/label/${labelData}`);
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
