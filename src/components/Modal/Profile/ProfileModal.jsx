import { Button, Form, Input, Modal } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// eslint-disable-next-line react/prop-types
const ProfileModal = ({ isOpen, callback }) => {
  const user = useSelector((state) => state.user);

  const handleOk = () => {
    callback(false);
  };
  const handleCancel = () => {
    callback(false);
  };
  const onFinish = (values) => {};
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      centered
      title="Profile"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: true,
      }}
      cancelButtonProps={{
        disabled: true,
      }}
    >
      <Form
        className="login__input__form"
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
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
          <Input
            placeholder="Email"
            size="large"
            disabled
            defaultValue={user.userInformation?.email || ""}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            size="large"
            type="text"
            defaultValue={user.userInformation?.name || ""}
          />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Surname"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            size="large"
            type="text"
            defaultValue={user.userInformation?.surname || ""}
          />
        </Form.Item>
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};
ProfileModal.propTypes = {
  showModal: PropTypes.func,
};
export default ProfileModal;
