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
export const updateStartDueDates = (data) => {
  const { cardId, listId, boardId, date } = data;
  return http.put(`/card/${boardId}/${listId}/${cardId}/dates`, date);
};
export const updateDateCompleted = (data) => {
  const { cardId, listId, boardId, completed } = data;
  console.log(data);
  return http.patch(
    `/card/${boardId}/${listId}/${cardId}/date-completed`,
    completed
  );
};
// const user = req.user;
// const { boardId, listId, cardId } = req.params;
// const { startDate, dueDate, dueTime } = req.body;
// router.put(
//   "/:boardId/:listId/:cardId/dates",
//   cardController.updateStartDueDates
// );
// router.put(
//   "/:boardId/:listId/:cardId/date-completed",
//   cardController.updateDateCompleted
// );
