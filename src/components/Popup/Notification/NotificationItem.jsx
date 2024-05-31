/* eslint-disable react/prop-types */
import { Flex } from "antd";
import "./notice.scss";
import formatDateTime from "../../../helpers/formatDatetime";
const NotificationItem = ({ notice = {} }) => {
  return (
    <Flex vertical className="notice-item">
      <div
        style={{
          fontSize: 14,
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
