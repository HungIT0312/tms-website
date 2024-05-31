const formatDateTime = (dateTimeStr) => {
  const dateTime = new Date(dateTimeStr);

  const day = String(dateTime.getDate()).padStart(2, "0");
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const year = dateTime.getFullYear();

  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");

  const now = new Date();

  const diffMinutes = Math.floor((now - dateTime) / (1000 * 60));

  // Xử lý logic
  if (diffMinutes < 1) {
    return "Bây giờ";
  } else if (diffMinutes >= 1 && diffMinutes < 10) {
    return `${diffMinutes} phút trước`;
  } else {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
};
export default formatDateTime;
