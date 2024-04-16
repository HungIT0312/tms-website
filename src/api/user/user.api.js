import http from "../../helpers/http";

export const getNewAccessToken = async () => {
  return http.post(`/user/refresh-token`);
};
export const logInUser = (userData) => {
  return http.post("/user/login", userData);
};
export const registerUser = (userData) => {
  return http.post("/user/register", userData);
};
export const getUser = (userData) => {
  return http.get("/user/get-user", userData);
};
export const getUserByEmail = (userData) => {
  return http.post("/user/get-user-with-email", userData);
};
// router.post("/register", userController.register);
// router.post("/login", userController.login);
// router.get("/get-user", userController.getUser);
// router.post("/get-user-with-email", userController.getUserWithMail);
// router.post("/refresh-token", userController.refreshToken);
