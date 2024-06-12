/* eslint-disable react/prop-types */
import { Flex } from "antd";
import "./notice.scss";
import formatDateTime from "../../../helpers/formatDatetime";
import { useNavigate } from "react-router-dom";
const NotificationItem = ({ notice = {} }) => {
  const navigate = useNavigate();
  const handleLink = () => {
    navigate(notice.link);
  };
  return (
    <Flex vertical className="notice-item" onClick={handleLink}>
      <div
        style={{
          fontSize: 14,
          color: "black !important",
        }}
        dangerouslySetInnerHTML={{ __html: notice?.message }}
      ></div>
      <small
        style={{
          fontSize: 14,
        }}
      >
        {formatDateTime(notice.createdAt)}
      </small>
    </Flex>
  );
};

export default NotificationItem;
