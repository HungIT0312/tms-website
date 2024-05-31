import { CheckOutlined } from "@ant-design/icons";
import { Col, Flex, Form, Image, Input, Modal, Row, notification } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { bgColors, bgImages } from "../../../constants/backgroundImage";
import images from "../../../constants/images";
import { createNewBoard } from "../../../stores/board/boardThunk";
import "./CreateBoard.scss";
// eslint-disable-next-line react/prop-types
const CreateBoard = ({ isOpen, showModal }) => {
  const [bgLink, setBgLink] = useState(images.bg1);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();
  const handleOk = () => {
    form.submit();
    const title = form.getFieldValue("title");
    const description = form.getFieldValue("description");
    if (title) {
      const value = {
        title,
        description,
        backgroundImageLink: bgLink,
        isImage: true,
      };
      dispatch(createNewBoard(value)).then(() => {
        api.success({
          message: `Tạo mới !`,
          description: "Thêm thành công",
          placement: "bottomRight",
        });
      });
    }
    showModal(false);
  };
  const handleCancel = () => {
    showModal(false);
  };
  const handleChangeBg = (value) => {
    setBgLink(value);
  };

  const renderBg = (arr) => {
    const render = arr.map((item, index) => (
      <Col span={8} key={index}>
        <div
          className={`${bgLink !== item ? "bg-image" : "bg-image--active"}`}
          onClick={() => handleChangeBg(item)}
        >
          <Image width={64} height={40} preview={false} src={item} />
          <div className="bg-image--checked">
            <CheckOutlined color="#fff" />
          </div>
        </div>
      </Col>
    ));
    return render;
  };
  return (
    <Modal
      centered
      title="Tạo bảng"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="create-board"
      okText={"Tạo"}
      cancelText={"Hủy"}
    >
      {contextHolder}
      <Flex
        className="create-board__content"
        justify="center"
        align="center"
        vertical
      >
        <Flex justify="center" align="center">
          <Row gutter={[16, 16]}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Flex vertical justify="center" align="center">
                <label>Xem trước</label>
                <div
                  className="create-board__preview"
                  style={{
                    background: `url(${bgLink})  no-repeat center/cover`,
                  }}
                >
                  <Image src={images.taskBg} preview={false} />
                </div>
              </Flex>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Flex vertical justify="center" align="center">
                <div style={{ width: 200 }}>
                  <Row gutter={[8, 8]}>{renderBg(bgImages)}</Row>
                </div>
                <div style={{ width: 200, marginTop: 8 }}>
                  <Row gutter={[8, 8]}>{renderBg(bgColors)}</Row>
                </div>
              </Flex>
            </Col>
          </Row>
        </Flex>

        <div style={{ marginTop: 4, width: "100%" }}>
          <Form
            className="createBoard"
            name="createBoard"
            layout="vertical"
            form={form}
          >
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề bảng!" },
              ]}
            >
              <Input className="create-board__inputTitle" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea
                className="create-board__description"
                rows={4}
                maxLength={150}
                showCount
              />
            </Form.Item>
          </Form>
        </div>
      </Flex>
    </Modal>
  );
};

export default CreateBoard;
