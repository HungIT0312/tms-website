/* eslint-disable react/no-unescaped-entities */
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Avatar, Flex, Tag, notification } from "antd";
import PropTypes from "prop-types";
import "./InvitationItem.scss";
import { useDispatch, useSelector } from "react-redux";
import { acceptBoardInvite } from "../../../../stores/board/boardThunk";
import { rejectInvite } from "../../../../stores/invitation/invitationThunk";
import formatDateTime from "../../../../helpers/formatDatetime";
// eslint-disable-next-line no-unused-vars
const InvitationItem = ({ invitation }) => {
  const { message } = useSelector((state) => state.board);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const handleAccept = async () => {
    const rs = await dispatch(acceptBoardInvite(invitation._id));
    if (rs) {
      api.success({
        message: `Accept invitation!`,
        description: message,
        placement: "bottomRight",
      });
    }
  };
  const handleReject = async () => {
    dispatch(rejectInvite(invitation._id));
  };
  return (
    <Flex className="invitation" align="center" justify="space-between" gap={8}>
      {contextHolder}
      <Flex gap={8} align="center" justify="center">
        <div>
          <Avatar style={{ background: invitation.inviter.color }}>
            {invitation.inviter.name[0] + invitation.inviter.surname[0]}
          </Avatar>
        </div>
        <Flex gap={8} vertical>
          <span className="invitation__text">
            <span>
              {invitation?.inviter?.name + " " + invitation?.inviter?.surname}
            </span>
            <span> đã mời bạn vào bảng "</span>
            <strong>{invitation?.board?.title}</strong>".
          </span>
          <Flex justify="space-between" align="center">
            <div className="invitation__date">
              {formatDateTime(invitation?.createdAt)}
            </div>
          </Flex>
        </Flex>
      </Flex>
      {invitation.status === "pending" && (
        <Flex justify="space-around" gap={16}>
          <CheckCircleTwoTone
            twoToneColor="#52c41a"
            className="invitation__action"
            onClick={handleAccept}
          />
          <CloseCircleTwoTone
            twoToneColor="red"
            className="invitation__action"
            onClick={handleReject}
          />
        </Flex>
      )}
      {invitation.status === "accepted" && (
        <Tag color="success">Đã chấp nhận</Tag>
      )}
    </Flex>
  );
};
InvitationItem.propTypes = {
  invitation: PropTypes.object,
};
export default InvitationItem;
