import { Button, Image } from "antd";
import { logo, welcome } from "../../constants/images";
import "./Welcome.scss";
import { useLocation, useNavigate } from "react-router-dom";
import changeTitle from "../../helpers/changeTitle";
const Welcome = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  changeTitle(pathname);
  return (
    <div className="welcome">
      <div className="welcome__nav">
        <div className="welcome__nav--item" onClick={() => navigate("/home")}>
          <Image width={60} src={logo} preview={false} />
          <div className="sitename">TMS</div>
        </div>

        <div className="welcome__nav--item">
          <div
            className="welcome__nav--btn welcome__nav--login"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </div>
          <div
            className="welcome__nav--btn welcome__nav--signup"
            onClick={() => navigate("/auth/register")}
          >
            Sign Up
          </div>
        </div>
      </div>
      <div className="welcome__wrap">
        <div className="welcome__title">
          TMS brings all your tasks, teammates, and tools together.
        </div>
        <div className="welcome__intro">
          Collaborate, manage projects and reach new productivity peaks. From
          high rises to the home office, the way your team work is
          unique--accomplish it all with TMS
        </div>
        <Button type="primary" className="welcome__button">
          Sign up - {"it's"} free
        </Button>
      </div>
      <div className="welcome__image">
        <Image width={600} src={welcome} preview={false} />
      </div>
    </div>
  );
};

export default Welcome;
