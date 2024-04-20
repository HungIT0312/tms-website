import { MailFilled } from "@ant-design/icons";
import { Avatar, Badge, Flex, Image } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import images from "../../constants/images";
import ProfileModal from "../Modal/Profile/ProfileModal";
import InvitationPopup from "../Popup/Ivitation/InvitationPopup";
import ProfilePopup from "../Popup/Profile/ProfilePopup";
import "./Header.scss";
export const Header = () => {
  const [isPopup, setIsPopup] = useState(false);
  const [isInvitationPop, setIsInvitationPop] = useState(false);
  const popupRef = useRef(null);
  const invitationRef = useRef(null);

  const [open, setOpen] = useState(false);
  const { userInformation } = useSelector((state) => state.user);

  const showModal = () => {
    setOpen(!open);
  };
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Flex align="center" justify="space-between" className="header">
      <Flex className="header__logo" align="center" justify="center">
        <Image
          className="header__logo--image"
          src={images.logo}
          preview={false}
          width={32}
        />
        <span className="header__logo--name">TMS</span>
      </Flex>
      <div className="header__right">
        <span
          className="header__mail"
          onClick={() => setIsInvitationPop(!isInvitationPop)}
        >
          <Badge size="small" count={5}>
            <MailFilled
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
            <InvitationPopup showModal={showModal} />
          </div>
        )}
        <ProfileModal isOpen={open} callback={setOpen} />
      </div>
    </Flex>
  );
};
