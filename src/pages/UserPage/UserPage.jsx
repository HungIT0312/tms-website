import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Tag,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UserPage.scss";
import { updateUserInfoUI } from "../../stores/user/userSlice";
import { updateUserInfo } from "../../stores/user/userThunk";

const UserPage = () => {
  const { userInformation } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isEditPass, setIsEditPass] = useState(false);
  const dispatch = useDispatch();
  const onFinish = (values) => {
    if (isEditPass) {
      try {
        dispatch(updateUserInfo(values));
        message.success("Cập nhật thành công");
      } catch (error) {
        message.error("Cập nhật không thành công");
      }
    } else {
      const dataUpdate = {
        ...userInformation,
        name: values?.name.trim(),
        surname: values?.surname.trim(),
        fullName: values?.surname + " " + values?.name,
      };
      try {
        dispatch(updateUserInfoUI(dataUpdate));
        dispatch(updateUserInfo(values));
        message.success("Cập nhật thành công");
      } catch (error) {
        message.error("Cập nhật không thành công");
      }
    }
    // Logic to update user information goes here
    setIsEdit(false);
    setIsEditPass(false);
  };
  useEffect(() => {
    form.setFieldsValue({
      name: userInformation?.name,
      surname: userInformation?.surname,
      email: userInformation?.email,
    });
  }, [form, userInformation]);

  const handleEditClick = () => {
    setIsEdit(true);
    setIsEditPass(false);
    form.setFieldsValue({
      name: userInformation?.name,
      surname: userInformation?.surname,
      email: userInformation?.email,
    });
  };

  const handleEditPassClick = () => {
    setIsEdit(false);

    setIsEditPass(true);
    form.setFieldsValue({
      password: "",
      confirm: "",
    });
  };

  return (
    <Flex className="user-page" justify="center" align="center" vertical>
      <Flex
        className="user-page__form"
        justify="center"
        align="center"
        vertical
        style={{ width: 420 }}
      >
        <Flex
          className="user-page__avatar"
          justify="center"
          align="center"
          vertical
          gap={8}
        >
          <Avatar size={84} style={{ background: `${userInformation?.color}` }}>
            {userInformation?.surname[0] + userInformation?.name[0]}
          </Avatar>
        </Flex>
        <Form.Item name="name" label="Tình trạng">
          {userInformation?.verified ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Đã xác thực
            </Tag>
          ) : (
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              Chưa xác thực
            </Tag>
          )}
        </Form.Item>
        <Flex className="user-page__group" vertical>
          <span className="title">Giới thiệu về bạn</span>

          <Form
            form={form}
            name="update"
            onFinish={onFinish}
            scrollToFirstError
            layout="vertical"
            className="login__input__form"
            style={{ width: 420 }}
          >
            <Row gutter={12}>
              <Col xs={24} md={12} lg={12}>
                <Form.Item
                  name="name"
                  label="Tên"
                  rules={[
                    {
                      required: isEdit,
                      message: "Vui lòng nhập tên của bạn!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input size="large" disabled={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <Form.Item
                  name="surname"
                  label="Họ"
                  rules={[
                    {
                      required: isEdit,
                      message: "Vui lòng nhập họ của bạn!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input size="large" disabled={!isEdit} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="email" label="Email">
              <Input size="large" disabled />
            </Form.Item>

            <Form.Item>
              {isEdit ? (
                <Flex gap={8}>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button
                    type="default"
                    onClick={() => {
                      setIsEdit(false);
                      form.setFieldsValue({
                        name: userInformation?.name,
                        surname: userInformation?.surname,
                        email: userInformation?.email,
                      });
                    }}
                  >
                    Hủy
                  </Button>
                </Flex>
              ) : (
                <Button
                  icon={<SettingOutlined />}
                  type="primary"
                  onClick={handleEditClick}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Form.Item>
          </Form>
        </Flex>
        <Flex className="user-page__group" vertical>
          <span className="title">Mật khẩu</span>
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
            {isEditPass && (
              <>
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
                        return Promise.reject(
                          new Error("Mật khẩu nhập lại không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>
              </>
            )}

            <Form.Item>
              {isEditPass ? (
                <Flex gap={8}>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button
                    type="default"
                    onClick={() => {
                      setIsEditPass(false);
                      form.resetFields(["password", "confirm"]);
                    }}
                  >
                    Hủy
                  </Button>
                </Flex>
              ) : (
                <Button
                  icon={<SettingOutlined />}
                  type="primary"
                  onClick={handleEditPassClick}
                >
                  Đổi mật khẩu
                </Button>
              )}
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserPage;
