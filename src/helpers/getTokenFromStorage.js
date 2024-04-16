export const getCookie = (name) => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

export const getTokenFromStorage = () => {
  return getCookie("accessToken");
};
export const getRefreshTokenFromStorage = () => {
  return getCookie("refreshToken");
};
