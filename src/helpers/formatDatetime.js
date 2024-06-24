import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(relativeTime);
const formatDateTime = (dateTimeStr) => {
  const dateTime = dayjs(dateTimeStr); // Parse the input date string as UTC
  const now = dayjs(); // Get the current time in UTC

  const diffMinutes = now.diff(dateTime, "minute"); // Calculate the difference in minutes

  if (diffMinutes < 1) {
    return "Bây giờ";
  } else if (diffMinutes >= 1 && diffMinutes < 10) {
    return `${diffMinutes} phút trước`;
  } else {
    return dateTime.format("DD/MM/YYYY HH:mm");
  }
};
export default formatDateTime;
