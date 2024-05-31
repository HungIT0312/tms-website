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
  return http.post(`/card/${cardId}/label/${labelData}`);
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
export const deleteCard = (data) => {
  const { cardId, listId, boardId } = data;
  return http.delete(`/card/${boardId}/${listId}/${cardId}`);
};
export const getCard = (cardId) => {
  return http.get(`/card/${cardId}`);
};
//==================================================================================
export const uploadAttachment = (data) => {
  const { cardId, listId, boardId, ...rest } = data;
  return http.post(`/card/${boardId}/${listId}/${cardId}/attachment`, rest);
};
export const deleteAttachment = (data) => {
  const { cardId, listId, boardId, attachmentId } = data;
  return http.post(
    `/card/${boardId}/${listId}/${cardId}/attachment/${attachmentId}`
  );
};

export const getActivities = (data) => {
  const { cardId, type } = data;
  return http.get(`/card/${cardId}/${type}`);
};
//=============================================================
export const addComment = (data) => {
  const { cardId, ...rest } = data;
  return http.post(`/card/${cardId}/comment`, rest);
};

export const updateComment = (data) => {
  const { cardId, commentId, ...rest } = data;
  return http.patch(`/card/${cardId}/comment/${commentId}`, rest);
};
export const deleteComment = (data) => {
  const { cardId, commentId, ...rest } = data;
  return http.post(`/card/${cardId}/comment/${commentId}`, rest);
};
// router.post("/:cardId/comment", cardController.addComment);
// router.put("/:cardId/comment/:commentId", cardController.updateComment);
// router.delete("/:cardId/comment/:commentId", cardController.deleteComment);
