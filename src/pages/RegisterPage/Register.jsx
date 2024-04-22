import { Button, Divider, Form, Input, message as msg } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../stores/user/userThunk";
const Register = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useSelector((state) => state.user);
  const onFinish = (values) => {
    dispatch(signUpUser(values));
    if (!loading && !error) {
      msg.success(message);
      navigate("/auth/login");
    }
    if (!loading && error) {
      msg.error(message);
    }
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      layout="vertical"
      className="login__input__form"
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please input your name!",
            whitespace: true,
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="surname"
        label="Surname"
        rules={[
          {
            required: true,
            message: "Please input your surname!",
            whitespace: true,
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
          {
            min: 6,
            message: "Password must be at least 6 characters.",
          },
        ]}
        hasFeedback
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Register
        </Button>
        <Divider plain></Divider>
        Already have an account ? <Link to={"/auth/login"}>Log in !</Link>
      </Form.Item>
    </Form>
  );
};

export default Register;
