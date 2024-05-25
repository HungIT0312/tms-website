import { Button, Image } from "antd";
import "./Welcome.scss";
import { useLocation, useNavigate } from "react-router-dom";
import changeTitle from "../../helpers/changeTitle";
import images from "../../constants/images";
const Welcome = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  changeTitle(pathname);
  return (
    <div className="welcome">
      <div className="welcome__nav">
        <div className="welcome__nav--item" onClick={() => navigate("/home")}>
          <Image width={80} src={images.logo} preview={false} />
        </div>

        <div className="welcome__nav--item">
          <div
            className="welcome__nav--btn welcome__nav--login"
            onClick={() => navigate("/auth/login")}
          >
            Đăng nhập
          </div>
          <div
            className="welcome__nav--btn welcome__nav--signup"
            onClick={() => navigate("/auth/register")}
          >
            Đăng ký
          </div>
        </div>
      </div>
      <div className="welcome__wrap">
        <div className="welcome__title">
          TMS là công cụ để cộng tác, quản lý dự án và nâng cao năng suất.
        </div>
        <div className="welcome__intro">
          Với các tính năng linh hoạt và dễ sử dụng, TMS mang đến một trải
          nghiệm làm việc liền mạch, giúp bạn theo dõi tiến độ, phân công nhiệm
          vụ và đảm bảo mọi công việc đều hoàn thành đúng hạn. Hãy để TMS trở
          thành trợ thủ đắc lực của bạn trên con đường chinh phục thành công.
        </div>
        <Button
          type="primary"
          className="welcome__button"
          onClick={() => navigate("/auth/register")}
        >
          Đăng ký ngay
        </Button>
      </div>
      <div className="welcome__image">
        <Image width={600} src={images.welcome} preview={false} />
      </div>
    </div>
  );
};

export default Welcome;
