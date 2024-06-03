/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import {
  CloseSquareOutlined,
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
  Tag,
  message,
} from "antd";
import { useState } from "react";
import { FiArchive } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteBoard, lockBoard } from "../../../api/board/board.api";
import { removeBoard } from "../../../stores/board/boardSlice";
import "./BoardDrawer.scss";
import Activities from "./Content/Activities";
import Archive from "./Content/Archive";
import Background from "./Content/Background";
import Info from "./Content/Info";

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
  const [isOpen2, setIsOpen2] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
          <>
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
            <Flex
              gap={12}
              className="delete drawer-item"
              align="center"
              onClick={deleteCurrentBoard}

              // onClick={lockCurrentBoard}
            >
              <CloseSquareOutlined
                className="drawer-item__icon"
                style={{ color: "red" }}
              />
              <Flex vertical>
                <span className="drawer-item__name" style={{ color: "red" }}>
                  Đóng dự án
                </span>
              </Flex>
            </Flex>
          </>
        )}

        {child && child}
      </Flex>
    );
  };

  const lockCurrentBoard = () => {
    setIsOpen(true);
  };
  const deleteCurrentBoard = () => {
    setIsOpen2(true);
  };
  const lockBoardById = async () => {
    try {
      const data = {
        boardId: selectedBoard?._id,
        isLocked: true,
      };
      dispatch(removeBoard(selectedBoard?._id));
      await lockBoard(data);
      message.success("Dự án đã được khóa");
      setIsOpen(false);
      navigate(`/`);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBoardById = async () => {
    try {
      dispatch(removeBoard(selectedBoard?._id));
      await deleteBoard(selectedBoard?._id);
      setIsOpen2(false);
      const input = document.getElementById("lock-board-input");
      input.value = "";
      message.success("Dự án đã được đóng.");
      navigate("/");
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
    lockBoardById();
  };
  const handleDeleteBoard = async () => {
    const input = document.getElementById("lock-board-input").value;
    if (input !== selectedBoard.title) {
      message.error("Tên dự án không đúng");
      return;
    }
    deleteBoardById();
  };
  const handleInputChange = async (e) => {
    const value = e.target.value;
    await setIsConfirmDisabled(value.trim() !== selectedBoard.title.trim());
  };
  const handleInputChange2 = async (e) => {
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
          ></Input>
        </Form.Item>
      </Form>
    </Flex>
  );
  const contentDelete = (
    <Flex vertical>
      <p>
        Cần cân nhắc kĩ trước khi thực hiện hành động, việc đóng dự án sẽ xóa
        các thông tin, tiến độ và thành viên có trong dự án. Hệ thống sẽ gửi
        thông báo đến thành viên. Bạn có thể lựa chọn
        <b style={{ margin: "0 4px" }}>khóa dự án</b>để lưu trữ dự án thay vì
        đóng hoàn toàn.
      </p>
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
        onOk={handleLockBoard}
        onCancel={() => {
          setIsOpen(false);
          const input = document.getElementById("lock-board-input");
          input.value = "";
        }}
        open={isOpen}
        okButtonProps={{
          disabled: isConfirmDisabled,
        }}
      >
        {content}
      </Modal>
      <Modal
        title="Bạn có muốn đóng dự án này không"
        okText="Đóng"
        okType="danger"
        cancelText="Hủy"
        centered={true}
        onOk={handleDeleteBoard}
        onCancel={() => {
          setIsOpen2(false);
          const input = document.getElementById("lock-board-input");
          input.value = "";
        }}
        open={isOpen2}
        okButtonProps={{
          disabled: isConfirmDisabled,
        }}
      >
        {contentDelete}
      </Modal>
    </Drawer>
  );
};

export default BoardDrawer;
