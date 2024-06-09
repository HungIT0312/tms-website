import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const InternalServer = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="500"
      title="500"
      subTitle="Xin lỗi, có lỗi xảy ra."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Trở về
        </Button>
      }
    />
  );
};
export default InternalServer;
