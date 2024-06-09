import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Trở về
        </Button>
      }
    />
  );
};
export default NotFoundPage;
