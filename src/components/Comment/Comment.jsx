/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Avatar, Flex } from "antd";
import formatDateTime from "../../helpers/formatDatetime";
import "./Comment.scss";
const Comment = ({ activity = {}, onEdit, isEdit = false }) => {
  return (
    <Flex
      style={{
        background: isEdit ? "#eee" : "#fff",
      }}
      gap={12}
      justify="start"
      align="start"
      className="comment"
      flex={1}
    >
      <div>
        <Avatar
          size={24}
          style={{ background: activity?.user?.color, fontSize: 12 }}
        >
          {activity?.user?.name[0] + activity?.user?.surname[0]}
        </Avatar>
      </div>
      <Flex vertical gap={4}>
        <span>
          <strong>
            {activity?.user?.name + " " + activity?.user?.surname}
          </strong>{" "}
          đã bình luận:
        </span>
        <div
          style={{ marginLeft: 8 }}
          dangerouslySetInnerHTML={{ __html: activity?.action }}
        ></div>
        <Flex gap={12}>
          <small>{formatDateTime(activity?.date)}</small>
          <small className="btn edit" onClick={() => onEdit(activity)}>
            Edit
          </small>
          <small className="btn delete">Delete</small>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Comment;
