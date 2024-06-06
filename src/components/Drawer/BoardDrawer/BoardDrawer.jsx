/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import {
  CloseSquareOutlined,
  InfoCircleOutlined,
  LockOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Button, Divider, Drawer, Flex, Image, message } from "antd";
import { useState } from "react";
import { FiArchive } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteBoard, lockBoard } from "../../../api/board/board.api";
import { removeBoard } from "../../../stores/board/boardSlice";
import DeleteBoard from "../../Modal/DeleteBoard/DeleteBoard";
import LockBoard from "../../Modal/LockBoard/LockBoard";
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
        {owner?.user._id == userInformation?._id && (
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
      message.error("Khóa dự án không thành công");
    }
  };
  const deleteBoardById = async () => {
    try {
      dispatch(removeBoard(selectedBoard?._id));
      await deleteBoard(selectedBoard?._id);
      setIsOpen2(false);
      message.success("Dự án đã được đóng.");
      navigate("/");
    } catch (error) {
      console.log(error);
      message.error("Đóng dự án không thành công");
    }
  };
  const handleLockBoard = async () => {
    lockBoardById();
  };
  const handleDeleteBoard = async () => {
    deleteBoardById();
  };

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
      <LockBoard
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleLockBoard={handleLockBoard}
      />

      <DeleteBoard
        isOpen2={isOpen2}
        setIsOpen2={setIsOpen2}
        handleDeleteBoard={handleDeleteBoard}
      />
    </Drawer>
  );
};

export default BoardDrawer;
