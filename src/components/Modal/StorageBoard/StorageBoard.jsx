/* eslint-disable react/prop-types */
import {
  CloseSquareOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Flex, Modal, Table, message } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteBoard, lockBoard } from "../../../api/board/board.api";
import { removeStorageBoard } from "../../../stores/board/boardSlice";
import DeleteBoard from "../DeleteBoard/DeleteBoard";
import UnlockBoard from "../UnlockBoard/UnlockBoard";

const StorageBoard = ({ isOpen, setIsOpen }) => {
  const { storageBoards } = useSelector((state) => state.board);
  const { userInformation } = useSelector((state) => state.user);
  const [isOpenUnlock, setIsOpenUnlock] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const navigate = useNavigate();
  const [board, setBoard] = useState({});
  const dispatch = useDispatch();

  const onClose = () => {
    setIsOpenUnlock(false);
  };
  const handleLockBoardSelected = (value, isOwner) => {
    if (isOwner) {
      setBoard(value);
      setIsOpenUnlock(true);
    } else {
      Modal.info({
        title: "Thông báo",
        content:
          "Bạn không có quyền tham gia dự án này. Hãy liên hệ với chủ sở hữu hoặc admin để truy cập",
        centered: true,
      });
    }
  };
  const lockBoardById = async () => {
    try {
      const data = {
        boardId: board?._id,
        isLocked: false,
      };
      await lockBoard(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLockBoard = async () => {
    lockBoardById();
    message.success("Dự án đã được mở ");
    onClose();
    const slug = _.kebabCase(board.title.toLowerCase());
    navigate(`/board/${board?._id}/${slug}`);
  };
  const columns = [
    {
      title: "Tên dự án",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "owner",
      key: "owner",
      render: (owner) => (
        <Flex className="BoardPreview__owner" align="center" gap={8}>
          <Avatar size={20} style={{ background: owner.color, fontSize: 8 }}>
            {owner.surname[0] + owner.name[0]}
          </Avatar>
          <span> {owner.surname + " " + owner.name}</span>
        </Flex>
      ),
    },
    {
      title: "Email ",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số thành viên",
      dataIndex: "members",
      key: "members",
      render: (text) => (
        <Flex gap={8}>
          <TeamOutlined style={{ fontSize: 16 }} />
          <span>{text}</span>
        </Flex>
      ),
    },

    {
      title: "Chi tiết",
      key: "action",
      render: (_, isOwner) => (
        <Flex gap={8}>
          {isOwner.action && (
            <>
              <Button
                onClick={() =>
                  handleLockBoardSelected(isOwner.board, isOwner.action)
                }
              >
                <UnlockOutlined />
              </Button>
              <Button
                type=""
                danger
                onClick={() => {
                  setBoard(isOwner.board);
                  setIsOpen2(true);
                }}
              >
                <CloseSquareOutlined />
              </Button>
            </>
          )}
          {!isOwner.action && (
            <Button
              onClick={() =>
                handleLockBoardSelected(isOwner.board, isOwner.action)
              }
            >
              <InfoCircleOutlined />
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  const dataBoard = storageBoards.map((b) => {
    const owner = b?.members?.find((member) => member.role === "owner");
    const isOwner = userInformation._id === owner.user;
    const newObj = {
      key: b._id,
      board: b,
      email: owner.email,
      title: b.title,
      owner: owner,
      members: b?.members.length,
      action: isOwner,
    };
    return newObj;
  });
  const deleteBoardById = async () => {
    try {
      await deleteBoard(board?._id);
      dispatch(removeStorageBoard(board?._id));
      setIsOpen2(false);
      message.success("Dự án đã được đóng.");
      navigate("/");
    } catch (error) {
      console.log(error);
      message.error("Đóng dự án không thành công");
    }
  };
  const handleDeleteBoard = async () => {
    deleteBoardById();
  };
  return (
    <Modal
      open={isOpen}
      title="Bảng bị khóa"
      centered={true}
      onCancel={() => setIsOpen(false)}
      footer={false}
      width={"calc(100vw - 300px)"}
    >
      <Table columns={columns} dataSource={dataBoard} />
      <UnlockBoard
        isOpen={isOpenUnlock}
        onClose={onClose}
        handleLockBoard={handleLockBoard}
        board={board}
      />
      <DeleteBoard
        isOpen2={isOpen2}
        setIsOpen2={setIsOpen2}
        isLock={true}
        handleDeleteBoard={handleDeleteBoard}
      />
    </Modal>
  );
};

export default StorageBoard;
