/* eslint-disable react/prop-types */
import "./InvitationPopup.scss";
import InvitationItem from "./InvitationItem/InvitationItem";
import { Empty } from "antd";
const InvitationPopup = ({ invitations = [] }) => {
  return (
    <div className="invitation_popup">
      <div className="invitation__title">Invitation</div>
      <div className="invitation__content">
        {invitations.length > 0 &&
          invitations.map((invitation) => (
            <InvitationItem key={invitation._id} invitation={invitation} />
          ))}
        {invitations.length < 1 && <Empty description={"No invitation"} />}
      </div>
    </div>
  );
};

export default InvitationPopup;
