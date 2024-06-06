/* eslint-disable react/prop-types */
import { Flex, Form, Input, Modal, Tag } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const LockBoard = ({ isOpen, setIsOpen, handleLockBoard }) => {
  const [textDel, setTextDel] = useState("");
  const { selectedBoard } = useSelector((state) => state.board);
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setTextDel(value);
  };

  const content = (
    <Flex vertical>
      <p>
        Việc khóa hay tạm dừng dự án sẽ làm các công việc bị hủy bỏ tạm thời,
        các thành viên có trong bảng sẽ không thể tương tác với bảng này nữa.
      </p>
      <Form layout="vertical">
        <Form.Item
          label={
            <Flex gap={4}>
              Hãy nhập lại tên dự án
              <Tag color="default" style={{ margin: "0px 4px" }}>
                {selectedBoard.title}
              </Tag>
              để khóa
            </Flex>
          }
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề bảng!" }]}
        >
          <Input
            id="lock-board-input"
            type="text"
            onChange={handleInputChange}
            value={textDel}
          ></Input>
        </Form.Item>
      </Form>
    </Flex>
  );
  return (
    <Modal
      title="Bạn có muốn khóa, tạm dừng dự án này không?"
      okText="Xác nhận"
      cancelText="Hủy"
      centered={true}
      onOk={handleLockBoard}
      onCancel={async () => {
        await setTextDel("");
        await setIsOpen(false);
      }}
      open={isOpen}
      okButtonProps={{
        disabled: textDel !== selectedBoard.title,
      }}
    >
      {content}
    </Modal>
  );
};

export default LockBoard;
