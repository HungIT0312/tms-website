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
  return http.patch(
    `/card/${boardId}/${listId}/${cardId}/date-completed`,
    completed
  );
};
//==================================================================================

export const changeMemberCard = (data) => {
  const { cardId, listId, boardId, memberId } = data;
  return http.patch(`/card/${boardId}/${listId}/${cardId}/member`, {
    memberId,
  });
};
