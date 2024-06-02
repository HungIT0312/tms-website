import http from "../../helpers/http";

export const createBoard = (boardData) => {
  return http.post(`/board/create`, boardData);
};
export const updateBoard = (boardData) => {
  const { boardId, ...data } = boardData;
  return http.put(`/board/${boardId}/update`, data);
};
export const getAllBoards = () => {
  return http.get("/board");
};
export const getBoardById = (boardId) => {
  return http.get(`/board/${boardId}`);
};
export const removeMemberInBoardById = (data) => {
  const { boardId, memberId } = data;
  return http.post(`/board/${boardId}/remove-member`, { memberId: memberId });
};
export const getActivityById = (data) => {
  const { page, boardId, limit } = data;
  return http.get(`/board/${boardId}/activity?page=${page}&limit=${limit}`);
};
//===============================================
export const updateLabel = (data) => {
  const { boardId, labelId, label } = data;
  return http.put(`/board/${boardId}/label/${labelId}`, label);
};
export const createLabel = (data) => {
  const { boardId, label } = data;
  return http.post(`/board/${boardId}/label`, label);
};
export const deleteLabel = (data) => {
  const { boardId, labelId } = data;
  return http.delete(`/board/${boardId}/label/${labelId}`);
};
export const getBoardStats = (boardId) => {
  return http.get(`/board/${boardId}/stats`);
};
export const lockBoard = (data) => {
  const { boardId, isLocked } = data;
  return http.post(`/board/${boardId}/lock`, { isLocked });
};
export const deleteBoard = (boardId) => {
  return http.delete(`/board/${boardId}`);
};
// route.post("/:boardId/lock", boardController.lockBoard);
// route.delete("/:boardId", boardController.deleteBoard);
