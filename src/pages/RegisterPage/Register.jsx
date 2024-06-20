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
  // const validateName = (_, value) => {
  //   const regex = /^[a-zA-Z\s]*$/;
  //   if (!regex.test(value)) {
  //     return Promise.reject(new Error("Chỉ nên chứa các chữ cái!"));
  //   }
  //   return Promise.resolve();
  // };
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
            name="surname"
            label="Họ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ của bạn!",
                whitespace: true,
              },
              {
                // validator: validateName,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <Form.Item
            name="name"
            label="Tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên của bạn!",
                whitespace: true,
              },
              {
                // validator: validateName,
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
            message: "Đầu vào email không hợp lệ!",
          },
          {
            required: true,
            message: "Vui lòng nhập email của bạnl!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu!",
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
        label="Nhập lại mật khẩu"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Vui lòng xác nhận mật khẩu của bạn!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu mới nhập không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Đăng ký
        </Button>
        <Divider plain></Divider>
        Đã có tài khoản ? <Link to={"/auth/login"}>Đăng nhập !</Link>
      </Form.Item>
    </Form>
  );
};

export default Register;
