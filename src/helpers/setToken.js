const setAccessToken = (accessToken) => {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  document.cookie = `accessToken=${accessToken}; expires=${expirationDate.toUTCString()}; path=/; `;
};

const setRefreshToken = (refreshToken) => {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  document.cookie = `refreshToken=${refreshToken}; expires=${expirationDate.toUTCString()}; path=/; `;
};

const deleteCookie = () => {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export { setRefreshToken, setAccessToken, deleteCookie };
