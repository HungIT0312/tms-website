const setAccessToken = (accessToken) => {
  document.cookie = `accessToken=${accessToken}; path=/; `;
};
const setRefreshToken = (refreshToken) => {
  document.cookie = `refreshToken=${refreshToken}; path=/; HttpOnly`;
};

export { setRefreshToken, setAccessToken };
