import http from "../../helpers/http";

export const getNewAccessToken = async () => {
  return http.post(`/user/refresh-token`);
};
export const logInUser = (userData) => {
  return http.post("/user/login", userData);
};
export const getUser = (userData) => {
  return http.get("/user/get-user", userData);
};
export const getUserByEmail = (userData) => {
  return http.post("/user/get-user-with-email", userData);
};
export const searchUser = (key) => {
  return http.post("/user/search", key);
};
export const registerUserByEmail = (userData) => {
  return http.post("/user/register-by-mail", userData);
};
export const verifyMail = (token) => {
  return http.post("/user/verify-mail", token);
};
export const updateUser = (data) => {
  return http.patch("/user/update-user", { ...data });
};
export const analysisUser = (data) => {
  return http.post("/user/stats", { ...data });
};
// router.post("/register", userController.register);
// router.post("/login", userController.login);
// router.get("/get-user", userController.getUser);
// router.get("/get-users", userController.getAllUsersByIds);
// router.post("/search", userController.searchUsers);
// router.post("/refresh-token", userController.refreshToken);
// router.post("/register-by-mail", userController.registerByEmail);
// router.post("/verify-mail", userController.verifyEmail);
