import { Image } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import images from "../../constants/images";
import changeTitle from "../../helpers/changeTitle";

const AuthLayout = () => {
  const getCurrentPathName = (pathname) => {
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart == "register") {
      return "Đăng ký";
    } else if (lastPart == "login") {
      return "Đăng nhập";
    }
    // return capitalizeFirstLetter(lastPart);
  };
  const { pathname } = useLocation();
  const pathParts = pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  changeTitle(pathname);
  return (
    <div className="login-container">
      <div>
        <Image
          className="trello_left"
          src={images.trelloLeft}
          preview={false}
        />
      </div>
      <div className="login__form">
        <div className="login__banner">
          <Image
            width={160}
            src={images.logo}
            preview={false}
            className="login__logo"
          />
          {/* <div className="login__sitename">TMS</div> */}
        </div>
        {(lastPart == "register" || lastPart == "login") && (
          <div className="">{getCurrentPathName(pathname)} để tiếp tục</div>
        )}
        <Outlet />
      </div>
      <div>
        <Image
          className="trello_right"
          src={images.trelloRight}
          preview={false}
        />
      </div>
    </div>
  );
};

export default AuthLayout;
