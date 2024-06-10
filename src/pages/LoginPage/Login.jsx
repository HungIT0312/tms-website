import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInUserByEmailPass } from "../../stores/user/userThunk";
import "./Login.scss";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    if (user.isLogin) {
      navigate("/");
    }
  }, [navigate, user.isLogin]);
  const onFinish = async (values) => {
    await dispatch(signInUserByEmailPass(values))
      .unwrap()
      .then((rs) => {
        if (rs) {
          api.success({
            message: `Đăng nhập thành công !`,
            description: rs.message,
            placement: "topRight",
          });
        }
      })
      .catch((err) => {
        api.error({
          message: `Đăng nhập không thành công !`,
          description: err.errMessage,
          placement: "topRight",
        });
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      className="login__input__form"
      name="normal_login"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {contextHolder}
      <Form.Item
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
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          size="large"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Đăng nhập
        </Button>
      </Form.Item>
      <Flex justify="space-between">
        <span>
          Bạn chưa có tài khoản?{" "}
          <Link to={"/auth/register"}>Đăng ký ngay !</Link>
        </span>
        <Link to={"/auth/forgot-pass"}>Quên mật khẩu</Link>
      </Flex>
    </Form>
  );
};

export default Login;
