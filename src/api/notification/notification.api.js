import http from "../../helpers/http";

export const getAllNotice = async () => {
  return http.get(`/notification`);
};
export const readAll = async (data) => {
  return http.post(`/notification`, data);
};
