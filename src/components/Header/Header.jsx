import { BellFilled, MailFilled } from "@ant-design/icons";
import { Avatar, Badge, Flex, Image } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import images from "../../constants/images";
import { getAllInvite } from "../../stores/invitation/invitationThunk";
import ProfileModal from "../Modal/Profile/ProfileModal";
import InvitationPopup from "../Popup/Ivitation/InvitationPopup";
import ProfilePopup from "../Popup/Profile/ProfilePopup";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import { socket } from "../../main";
import { setNotifications } from "../../stores/notice/noticeSlice";
import { getAllNoticeById } from "../../stores/notice/noticeThunk";
import NotificationPopup from "../Popup/Notification/NotificationPopup";
import { updateCardMemberUI } from "../../stores/list/ListSlice";
import { setAddInvitation } from "../../stores/invitation/invitationSlice";

export const Header = () => {
  const [isPopup, setIsPopup] = useState(false);
  const [isInvitationPop, setIsInvitationPop] = useState(false);
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const invitationRef = useRef(null);

  const noticeRef = useRef(null);
  const [isNoticePop, setIsNoticePop] = useState(false);

  const { userInformation } = useSelector((state) => state.user);
  const { invitations } = useSelector((state) => state.invitation);
  const { notifications, newMessageCount } = useSelector(
    (state) => state.notice
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showModal = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (userInformation?._id) {
      socket.emit("join", { userId: userInformation._id });
      dispatch(getAllInvite({ userId: userInformation._id }));
      dispatch(getAllNoticeById(""));
    }
  }, [dispatch, userInformation]);

  useEffect(() => {
    socket.on("sendInvitation", (value) => {
      dispatch(setAddInvitation(value.data));
    });

    return () => {
      socket.off("changeCardMember");
      socket.off("sendInvitation");
    };
  }, [dispatch, notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopup(false);
      }
      if (
        invitationRef.current &&
        !invitationRef.current.contains(event.target)
      ) {
        setIsInvitationPop(false);
      }
      if (noticeRef.current && !noticeRef.current.contains(event.target)) {
        setIsNoticePop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const countMail = useMemo(() => {
    return invitations.reduce(
      (acc, curr) => (curr.status === "pending" ? acc + 1 : acc),
      0
    );
  }, [invitations]);

  return (
    <Flex align="center" justify="space-between" className="header">
      <Flex
        className="header__logo"
        align="center"
        justify="center"
        onClick={() => navigate("/")}
      >
        <Image
          className="header__logo--image"
          src={images.logo}
          preview={false}
          width={120}
        />
      </Flex>
      <div className="header__right">
        <span
          className="header__mail"
          onClick={() => setIsInvitationPop(!isInvitationPop)}
        >
          <Badge size="small" count={countMail} showZero>
            <MailFilled
              style={{
                fontSize: 20,
                color: "#44546f",
              }}
            />
          </Badge>
        </span>
        <span
          className="header__mail"
          onClick={() => setIsNoticePop(!isNoticePop)}
        >
          <Badge size="small" count={newMessageCount}>
            <BellFilled
              style={{
                fontSize: 20,
                color: "#44546f",
              }}
            />
          </Badge>
        </span>
        <div className="header__avatar" onClick={() => setIsPopup(!isPopup)}>
          <Avatar style={{ background: `${userInformation.color}` }}>
            {userInformation.name[0] + userInformation.surname[0]}
          </Avatar>
        </div>
        {isPopup && (
          <div className="header__popup" ref={popupRef}>
            <ProfilePopup showModal={showModal} />
          </div>
        )}
        {isInvitationPop && (
          <div
            className="header__popup header__popup--mail"
            ref={invitationRef}
          >
            <InvitationPopup showModal={showModal} invitations={invitations} />
          </div>
        )}
        {isNoticePop && (
          <div className="header__popup header__popup--mail" ref={noticeRef}>
            <NotificationPopup
              showModal={showModal}
              notifications={notifications}
            />
          </div>
        )}
        <ProfileModal isOpen={open} callback={setOpen} />
      </div>
    </Flex>
  );
};
