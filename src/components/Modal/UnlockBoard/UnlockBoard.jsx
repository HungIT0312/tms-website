/* eslint-disable react/prop-types */
import { Flex, Form, Input, Modal } from "antd";
import { useState } from "react";

const UnlockBoard = ({ isOpen, onClose, handleLockBoard, board }) => {
  const [textDel, setTextDel] = useState("");
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setTextDel(value);
  };
  const content = (
    <Flex vertical>
      <p>
        Mở lại bảng, dự án các thành viên có thể làm việc trở lại trên bảng, dự
        án này như bình thường.
      </p>
      <Form layout="vertical">
        <Form.Item
          label={
            <p>
              Hãy nhập lại tên bảng
              <span
                style={{
                  background: "#eee",
                  padding: 4,
                  margin: 4,
                  borderRadius: 4,
                }}
              >
                {board?.title}
              </span>
              để mở khóa
            </p>
          }
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề bảng!" }]}
        >
          <Input
            id="lock-board-input"
            type="text"
            onChange={handleInputChange}
          ></Input>
        </Form.Item>
      </Form>
    </Flex>
  );
  return (
    <Modal
      open={isOpen}
      title="Bạn có muốn xác nhận mở lại bảng không?"
      okText="Xác nhận"
      cancelText="Hủy"
      centered={true}
      onOk={handleLockBoard}
      onCancel={onClose}
      okButtonProps={{
        disabled: textDel !== board?.title,
      }}
    >
      {content}
    </Modal>
  );
};

export default UnlockBoard;
