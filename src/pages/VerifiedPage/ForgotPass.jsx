import { Button, Flex, Form, Input, Result, message } from "antd";
import { forgotPass } from "../../api/user/user.api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const rs = await forgotPass({ email: values.email });
      if (rs) {
        message.success(rs.message);
      }
    } catch (error) {
      message.error(error?.errMessage);
    }

    setIsSent(true);
  };
  return (
    <Flex>
      {isSent && (
        <Result
          status="success"
          title="Đã gửi mã qua email"
          subTitle="Vui lòng check email của bạn để xác nhận"
          extra={[
            <Button type="primary" key="console" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>,
          ]}
        />
      )}
      {!isSent && (
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label=" Nhập email để gửi mã khôi phục mật khẩu"
            name="email"
            rules={[
              {
                type: "email",
                message: "Đầu vào email không hợp lệ !",
              },
              {
                required: true,
                message: "Vui lòng nhập email của bạn!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      )}
    </Flex>
  );
};

export default ForgotPasswordPage;
