/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import {
  InfoCircleOutlined,
  LockOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Drawer,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  message,
} from "antd";
import { useState } from "react";
import { FiArchive } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./BoardDrawer.scss";
import Activities from "./Content/Activities";
import Archive from "./Content/Archive";
import Background from "./Content/Background";
import Info from "./Content/Info";
import { lockBoard } from "../../../api/board/board.api";

const BoardDrawer = ({
  open,
  onClose,
  selectedBoard = {},
  renderKey,
  setRenderKey,
}) => {
  const owner = (selectedBoard.members || []).filter(
    (member) => member.role === "owner"
  )[0];
  const { userInformation } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const navigate = useNavigate();
  const renderDrawerContent = (child) => {
    return (
      <Flex vertical gap={8}>
        <Flex
          gap={12}
          className="drawer-item"
          align="start"
          onClick={() => setRenderKey("info")}
        >
          <InfoCircleOutlined className="drawer-item__icon" />
          <Flex vertical>
            <span className="drawer-item__name">Về bảng này</span>
            <span className="drawer-item__sub">Thêm mô tả của bảng</span>
          </Flex>
        </Flex>
        <Flex
          gap={12}
          className="drawer-item"
          align="center"
          onClick={() => setRenderKey("activity")}
        >
          <ProjectOutlined className="drawer-item__icon" />
          <Flex vertical>
            <span className="drawer-item__name">Các hoạt động</span>
          </Flex>
        </Flex>
        <Flex
          gap={12}
          className="drawer-item"
          align="center"
          onClick={() => setRenderKey("bg")}
        >
          <Image
            src={selectedBoard?.backgroundImageLink}
            width={20}
            height={20}
            style={{ borderRadius: 4 }}
          />
          <Flex vertical>
            <span className="drawer-item__name">Thay đổi nền</span>
          </Flex>
        </Flex>
        <Divider />

        <Flex
          gap={12}
          className="drawer-item"
          align="center"
          onClick={() => setRenderKey("archive")}
        >
          <FiArchive className="drawer-item__icon" />
          <Flex vertical>
            <span className="drawer-item__name">Danh sách lưu trữ</span>
          </Flex>
        </Flex>
        {owner?.user == userInformation?._id && (
          <Flex
            gap={12}
            className="drawer-item"
            align="center"
            onClick={lockCurrentBoard}
          >
            <LockOutlined className="drawer-item__icon" />
            <Flex vertical>
              <span className="drawer-item__name">Khóa dự án</span>
            </Flex>
          </Flex>
        )}

        {child && child}
      </Flex>
    );
  };

  const lockCurrentBoard = () => {
    setIsOpen(true);
  };
  const lockBoardById = async () => {
    try {
      const data = {
        boardId: selectedBoard?._id,
        isLocked: true,
      };
      await lockBoard(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLockBoard = async () => {
    const input = document.getElementById("lock-board-input").value;
    if (input !== selectedBoard.title) {
      message.error("Tên dự án không đúng");
      return;
    }
    message.success("Dự án đã được khóa");
    setIsOpen(false);
    lockBoardById();
    navigate(`/`);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    await setIsConfirmDisabled(value.trim() !== selectedBoard.title.trim());
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
            <p>
              Hãy nhập lại tên dự án
              <span
                style={{
                  background: "#eee",
                  padding: 4,
                  margin: 4,
                  borderRadius: 4,
                }}
              >
                {selectedBoard.title}
              </span>
              để khóa
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
    <Drawer
      title="Menu"
      placement="right"
      onClose={onClose}
      open={open}
      getContainer={".board"}
      extra={
        renderKey !== "" &&
        renderKey !== "analysis" && (
          <Flex>
            <Button type="text" onClick={() => setRenderKey("")}>
              Trở lại
            </Button>
          </Flex>
        )
      }
    >
      {renderKey === "" && renderDrawerContent(<></>)}
      {renderKey === "info" && (
        <Info owner={owner} selectedBoard={selectedBoard} />
      )}
      {renderKey === "activity" && <Activities selectedBoard={selectedBoard} />}
      {renderKey === "archive" && <Archive />}
      {renderKey === "bg" && <Background />}
      <Modal
        title="Bạn có muốn khóa, tạm dừng dự án này không?"
        okText="Xác nhận"
        cancelText="Hủy"
        centered={true}
        content={content}
        onOk={handleLockBoard}
        onCancel={() => setIsOpen(false)}
        open={isOpen}
        okButtonProps={{
          disabled: isConfirmDisabled,
        }}
      >
        {content}
      </Modal>
    </Drawer>
  );
};

export default BoardDrawer;
