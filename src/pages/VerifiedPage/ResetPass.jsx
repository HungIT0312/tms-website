import { Button, Flex, Form, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPass } from "../../api/user/user.api";

const ResetPass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const repass = location.search.replace("?repass=", "");
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const data = {
      resetToken: repass,
      newPassword: values.password,
    };
    try {
      const fetchForgot = async () => {
        const rs = await resetPass(data);
        if (rs) {
          message.success(rs?.message);
          navigate("/auth/login");
        } else {
          message.error(rs?.errMessage);
        }
      };
      fetchForgot();
    } catch (error) {
      message.error(error?.errMessage);
    }
  };
  return (
    <Form
      form={form}
      name="password"
      onFinish={onFinish}
      scrollToFirstError
      layout="vertical"
      className="login__input__form"
      style={{ width: 420 }}
    >
      {/* <Form.Item name="email" label="Email">
              <Input size="large" disabled value={userInformation?.email} />
            </Form.Item> */}
      <Form.Item
        name="password"
        label="Mật khẩu mới"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu mới!",
          },
          {
            min: 6,
            message: "Mật khẩu phải có ít nhất 6 ký tự.",
          },
        ]}
        hasFeedback
      >
        <Input.Password size="large" />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Nhập lại mật khẩu mới"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Vui lòng xác nhận mật khẩu mới!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item>
        <Flex gap={8}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
          <Button type="default">Hủy</Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default ResetPass;
