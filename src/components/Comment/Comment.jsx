/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Avatar, Flex, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import formatDateTime from "../../helpers/formatDatetime";
import "./Comment.scss";
import {
  deleteCommentById,
  updateCommentById,
} from "../../stores/card/cardThunk";
const Comment = ({ activity = {}, onEdit, isEdit = false, deleteAct }) => {
  const { userInformation } = useSelector((state) => state.user);
  const isOwner = activity?.user?._id === userInformation?._id;
  const { selectedBoard } = useSelector((state) => state.board);
  const { selectedCard } = useSelector((state) => state.card);
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const isBoardOwner = selectedBoard?.members?.some(
    (mem) =>
      mem.user.toString() === userInformation._id.toString() &&
      mem.role === "owner"
  );
  const deleteCmt = () => {
    const data = {
      boardId: boardId,
      listId: selectedCard?.owner,
      cardId: selectedCard?._id,
      commentId: activity?._id,
    };
    deleteAct(activity?._id);
    dispatch(deleteCommentById(data));
    message.success("Xóa thành công");
  };

  

  const confirm = (e) => {
    deleteCmt();
  };
  const cancel = (e) => {};
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
          {activity?.user?.surname[0] + activity?.user?.name[0]}
        </Avatar>
      </div>
      <Flex vertical gap={4}>
        <span>
          <strong>
            {activity?.user?.surname + " " + activity?.user?.name}
          </strong>{" "}
          đã bình luận:
        </span>
        <div
          style={{ marginLeft: 8 }}
          dangerouslySetInnerHTML={{ __html: activity?.action }}
        />
        <Flex gap={12}>
          <small>{formatDateTime(activity?.date)}</small>
          <Flex gap={12}>
            {isOwner && (
              <small className="btn edit" onClick={() => onEdit(activity)}>
                Sửa
              </small>
            )}
            {(isBoardOwner || isOwner) && (
              <Popconfirm
                title="Xóa bình luận"
                description="Bạn muốn xóa bình luận này?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Xóa"
                cancelText="Hủy"
                okType="danger"
              >
                <small className="btn delete">Xóa</small>
              </Popconfirm>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Comment;
