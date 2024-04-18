import { useSelector } from "react-redux";
import "./InvitationPopup.scss";
import InvitationItem from "./InvitationItem/InvitationItem";
const InvitationPopup = () => {
  const { userInformation } = useSelector((state) => state.user);
  return (
    <div className="invitation_popup">
      <div className="invitation__title">Invitation</div>
      <div className="invitation__content">
        {/* {userInformation.invitations &&
        userInformation.invitations.length > 0 ? (
          userInformation.invitations.map((invitation) => (
            <InvitationItem key={invitation._id} invitation={invitation} />
          ))
        ) : (
          <div className="invitation__empty">No more invitations</div>
        )} */}
        {userInformation.invitations.map((invitation) => (
          <InvitationItem key={invitation._id} invitation={invitation} />
        ))}
        <InvitationItem />
        <InvitationItem />
        <InvitationItem />
        <InvitationItem />
        <InvitationItem />
      </div>
    </div>
  );
};

export default InvitationPopup;
