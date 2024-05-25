/* eslint-disable react/prop-types */
import "./InvitationPopup.scss";
import InvitationItem from "./InvitationItem/InvitationItem";
import { Empty } from "antd";
const InvitationPopup = ({ invitations = [] }) => {
  return (
    <div className="invitation_popup">
      <div className="invitation__title">Lời mời</div>
      <div className="invitation__content">
        {invitations.length > 0 &&
          invitations.map((invitation) => (
            <InvitationItem key={invitation._id} invitation={invitation} />
          ))}
        {invitations.length < 1 && <Empty description={"Không có lời mời"} />}
      </div>
    </div>
  );
};

export default InvitationPopup;
