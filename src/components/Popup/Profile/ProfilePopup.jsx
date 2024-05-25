import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Flex, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./ProfilePopup.scss";
import { logOut } from "../../../stores/user/userSlice";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProfilePopup = (props) => {
  const { userInformation } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    dispatch(logOut());
    message.success("Logout successful!");
    navigate("/home");
  };
  const handleChangeAccount = () => {
    dispatch(logOut());
    navigate("/auth/login");
  };
  return (
    <div className="profilePopup">
      <div className=" profilePopup__title">Tài khoản</div>
      <Flex
        className="profilePopup__item"
        align="center"
        onClick={props?.showModal}
      >
        <div className="profilePopup__avatar">
          <Avatar style={{ background: `${userInformation.color}` }}>
            {userInformation.name[0] + userInformation.surname[0]}
          </Avatar>
        </div>
        <Flex vertical className="profilePopup__info">
          <span className="profilePopup__name">
            {userInformation.name + " " + userInformation.surname}
          </span>
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
