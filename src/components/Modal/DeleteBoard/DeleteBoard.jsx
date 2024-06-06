/* eslint-disable react/prop-types */
import { Flex, Form, Input, Modal, Tag } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const DeleteBoard = ({
  isOpen2,
  setIsOpen2,
  handleDeleteBoard,
  isLock = false,
}) => {
  const [textDel, setTextDel] = useState("");
  const { selectedBoard } = useSelector((state) => state.board);
  const handleInputChange2 = async (e) => {
    const value = e.target.value;
    setTextDel(value);
  };
  const noidung = (
    <p>
      Cần cân nhắc kĩ trước khi thực hiện hành động, việc đóng dự án sẽ xóa các
      thông tin, tiến độ và thành viên có trong dự án. Hệ thống sẽ gửi thông báo
      đến thành viên. Hiện tại bảng đã được khóa.
    </p>
  );
  const contentDelete = (
    <Flex vertical>
      {isLock ? (
        noidung
      ) : (
        <p>
          Cần cân nhắc kĩ trước khi thực hiện hành động, việc đóng dự án sẽ xóa
          các thông tin, tiến độ và thành viên có trong dự án. Hệ thống sẽ gửi
          thông báo đến thành viên. Bạn có thể lựa chọn
          <b style={{ margin: "0 4px" }}>khóa dự án</b>để lưu trữ dự án thay vì
          đóng hoàn toàn.
        </p>
      )}

      <Form layout="vertical">
        <Form.Item
          label={
            <p>
              Nếu đã xác nhận, hãy nhập lại tên dự án
              <Tag color="error" style={{ margin: "0px 4px" }}>
                {selectedBoard.title}
              </Tag>
              để đóng dự án này
            </p>
          }
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề bảng!" }]}
        >
          <Input
            id="lock-board-input"
            type="text"
            onChange={handleInputChange2}
            value={textDel}
            defaultValue={""}
          />
        </Form.Item>
      </Form>
    </Flex>
  );
  return (
    <Modal
      title="Bạn có muốn đóng dự án này không"
      okText="Đóng"
      okType="danger"
      cancelText="Hủy"
      centered={true}
      onOk={handleDeleteBoard}
      onCancel={async () => {
        await setTextDel("");
        await setIsOpen2(false);
      }}
      open={isOpen2}
      okButtonProps={{
        disabled: textDel !== selectedBoard.title,
      }}
    >
      {contentDelete}
    </Modal>
  );
};

export default DeleteBoard;
