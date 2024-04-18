import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Avatar, Flex } from "antd";
import PropTypes from "prop-types";
import "./InvitationItem.scss";
const InvitationItem = ({ invitation }) => {
  // const statusRender = () => {
  //   if (invitation.status === "pending")
  //     return <span className="text-warning">Pendiente</span>;
  //   else if (invitation.status === "accepted")
  //     return <span className="text-success">Aceptado</span>;
  //   else return <span className="text-danger">Rechazado</span>;
  // };
  return (
    <Flex className="invitation" direction="column" align="center" gap={8}>
      {/* <div>{invitation.inviter || "Nguyen Hung"}</div>
      <div>{statusRender()}</div>
      <div>{invitation.board.title || "board-01"}</div>
      <div>{invitation.board.createdAt || "10-12-2024"}</div>
      <div>{invitation.board.updatedAt || "10-12-2024"}</div> */}
      <div>
        <Avatar>HN</Avatar>
      </div>
      <Flex gap={8} vertical>
        <span className="invitation__text">
          <span>Nguyen Hung</span>
          <span> invited you to join "</span>
          <strong>board-01</strong>".
        </span>
        <Flex justify="space-between" align="center">
          <div className="invitation__date">Invited at 10-12-2024</div>
          {/* <Tag icon={<CheckCircleOutlined />} color="success">
            accepted
          </Tag> */}
        </Flex>
      </Flex>
      <Flex justify="space-around" gap={16}>
        <CheckCircleTwoTone
          twoToneColor="#52c41a"
          className="invitation__action"
        />
        <CloseCircleTwoTone twoToneColor="red" className="invitation__action" />
      </Flex>
    </Flex>
  );
};
InvitationItem.propTypes = {
  invitation: PropTypes.object,
};
export default InvitationItem;
// board: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "board",
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     required: true,
//   },
//   updatedAt: {
//     type: Date,
//   },
