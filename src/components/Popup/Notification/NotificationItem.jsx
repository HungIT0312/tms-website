/* eslint-disable react/prop-types */
import { Flex } from "antd";
import "./notice.scss";
const NotificationItem = ({ notice = {} }) => {
  const date = new Date(notice.createdAt).toLocaleDateString("en-GB");

  return (
    <Flex vertical className="notice-item">
      <div dangerouslySetInnerHTML={{ __html: notice?.message }}></div>
      <div className="invitation__date">At {date}</div>
    </Flex>
  );
};

export default NotificationItem;
