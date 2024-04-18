const setAccessToken = (accessToken) => {
  document.cookie = `accessToken=${accessToken}; path=/; `;
};
const setRefreshToken = (refreshToken) => {
  document.cookie = `refreshToken=${refreshToken}; path=/; `;
};
const deleteCookie = () => {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
export { setRefreshToken, setAccessToken, deleteCookie };
