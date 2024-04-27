import { Button, Col, Divider, Form, Input, Row, message as msg } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signUpUserByEmail } from "../../stores/user/userThunk";
import "./Register.scss";
const Register = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch(signUpUserByEmail(values))
      .unwrap()
      .then((response) => {
        navigate("/auth/login");
        msg.success(response.message);
      })
      .catch((error) => {
        msg.error(error.errMessage);
      });
  };
  const validateName = (_, value) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(value)) {
      return Promise.reject(new Error("Should contain only letters!"));
    }
    return Promise.resolve();
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
      <Row gutter={12}>
        <Col xs={24} md={12} lg={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
                whitespace: true,
              },
              {
                validator: validateName,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <Form.Item
            name="surname"
            label="Surname"
            rules={[
              {
                required: true,
                message: "Please input your surname!",
                whitespace: true,
              },
              {
                validator: validateName,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
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
