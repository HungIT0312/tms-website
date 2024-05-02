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
// getActivityById;
// route.post("/:boardId/add-member", boardController.addMember);
// route.post("/create", boardController.create);
// route.get("/:id", boardController.getById);
// route.get("/:id/activity", boardController.getActivityById);
// route.get("/", boardController.getAll);
//route.put("/:boardId/update", boardController.updateBoardProperty);
