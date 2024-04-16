import { Image } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { logo, trelloLeft, trelloRight } from "../../constants/images";
import changeTitle, { capitalizeFirstLetter } from "../../helpers/changeTitle";

const AuthLayout = () => {
  const getCurrentPathName = (pathname) => {
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    return capitalizeFirstLetter(lastPart);
  };
  const { pathname } = useLocation();
  changeTitle(pathname);
  return (
    <div className="login-container">
      <div>
        <Image className="trello_left" src={trelloLeft} preview={false} />
      </div>
      <div className="login__form">
        <div className="login__banner">
          <Image
            width={30}
            src={logo}
            preview={false}
            className="login__logo"
          />
          <div className="login__sitename">TMS</div>
        </div>
        <div className="">{getCurrentPathName(pathname)} to continue</div>
        <Outlet />
      </div>
      <div>
        <Image className="trello_right" src={trelloRight} preview={false} />
      </div>
    </div>
  );
};

export default AuthLayout;
