import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Flex, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./ProfilePopup.scss";
import { logOut } from "../../../stores/user/userSlice";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProfilePopup = () => {
  const { userInformation } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    dispatch(logOut());
    message.success("Đã đăng xuất!");
    navigate("/home");
  };
  const handleChangeAccount = () => {
    dispatch(logOut());
    navigate("/auth/login");
  };
  const removedEmail = userInformation?.email.split("@")[0];
  return (
    <div className="profilePopup">
      <div className=" profilePopup__title">Tài khoản</div>
      <Flex
        className="profilePopup__item"
        align="center"
        onClick={() => navigate(`/user/${removedEmail}`)}
      >
        <div className="profilePopup__avatar">
          <Avatar style={{ background: `${userInformation.color}` }}>
            {userInformation.surname[0] + userInformation.name[0]}
          </Avatar>
        </div>
        <Flex vertical className="profilePopup__info">
          <span className="profilePopup__name">{userInformation.fullName}</span>
          <span className="profilePopup__mail">{userInformation.email}</span>
        </Flex>
      </Flex>
      <hr />
      <div className="profilePopup__item" onClick={handleChangeAccount}>
        Chuyển tài khoản
      </div>
      <Flex
        className="profilePopup__logout profilePopup__item"
        onClick={handleLogOut}
        gap={8}
      >
        <span>Đăng xuất</span>
        <LogoutOutlined />
      </Flex>
    </div>
  );
};
ProfilePopup.propTypes = {
  showModal: PropTypes.func,
};
export default ProfilePopup;
