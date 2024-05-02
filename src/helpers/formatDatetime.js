const formatDateTime = (dateTimeStr) => {
  // Chuyển đổi chuỗi thành đối tượng Date
  const dateTime = new Date(dateTimeStr);

  // Lấy ngày, tháng, năm
  const day = String(dateTime.getDate()).padStart(2, "0");
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const year = dateTime.getFullYear();

  // Lấy giờ và phút
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");

  // Lấy thời gian hiện tại
  const now = new Date();

  // Tính số phút chênh lệch giữa thời gian hiện tại và thời gian đưa vào
  const diffMinutes = Math.floor((now - dateTime) / (1000 * 60));

  // Xử lý logic
  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes >= 1 && diffMinutes < 10) {
    return `${diffMinutes} minutes ago`;
  } else {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
};
export default formatDateTime;
