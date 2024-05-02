import http from "../../helpers/http";

// Lấy tất cả các danh sách
export const getAllLists = async (boardId) => {
  return http.get(`/list/${boardId}`);
};

// Tạo một danh sách mới
export const createList = async (listData) => {
  return http.post(`/list/create`, listData);
};

// Xóa một danh sách
export const deleteList = async (boardId, listId) => {
  return http.delete(`/list/${boardId}/${listId}`);
};

// Cập nhật tiêu đề của một danh sách
export const updateListTitle = async (boardId, listId, newTitle) => {
  return http.put(`/list/${boardId}/${listId}/update-title`, {
    title: newTitle,
  });
};

// Cập nhật thứ tự của các thẻ trong một danh sách
export const updateCardOrder = async (cardOrderData) => {
  return http.post(`/list/change-card-order`, cardOrderData);
};

// Cập nhật thứ tự của các danh sách
export const updateListOrder = async (listOrderData) => {
  return http.post(`/list/change-list-order`, listOrderData);
};
