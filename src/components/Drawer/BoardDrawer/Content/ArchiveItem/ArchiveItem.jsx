/* eslint-disable react/prop-types */
import {
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Flex, Modal, Popover, message } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import listProperty from "../../../../../constants/listProperty";
import { useDispatch } from "react-redux";
import {
  deleteListById,
  updateListInfo,
} from "../../../../../stores/list/ListThunk";

const ArchiveItem = ({ list }) => {
  const [open, setOpen] = useState(false);
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const hide = () => {
    setOpen(false);
  };
  const handleShowPop = () => {
    setOpen(!open);
  };
  const handleDelete = () => {
    const deleteData = {
      boardId: boardId,
      listId: list?._id,
    };
    dispatch(deleteListById(deleteData));
    message.success({
      content: "Successfully deleted the archive.",
    });
  };
  const handleListStateChange = () => {
    const updateData = {
      boardId: boardId,
      listId: list?._id,
      value: false,
      property: listProperty.DESTROY,
    };
    dispatch(updateListInfo(updateData));
  };
  const content = (
    <Flex vertical gap={8}>
      <Flex
        gap={8}
        className="pop__item"
        onClick={() => {
          Modal.confirm({
            icon: (
              <ExclamationCircleOutlined
                style={{ color: "#FF4D4", fontSize: "20px" }}
              />
            ),
            title: "Are you sure to restore this list?",
            okText: "Restore",
            cancelText: "Cancel",
            onOk: handleListStateChange,
            centered: true,
            content: "This list will be back to board ",
          });
        }}
      >
        <SyncOutlined />
        Restore
      </Flex>
      <Flex
        gap={8}
        className="pop__item pop__item--delete"
        onClick={() => {
          Modal.confirm({
            icon: (
              <ExclamationCircleOutlined
                style={{ color: "#FF4D4", fontSize: "20px" }}
              />
            ),
            title: "Are you sure to delete this list?",
            okText: "Delete",
            cancelText: "Cancel",
            onOk: handleDelete,
            centered: true,
            content: "This list will be delete from website",
            okButtonProps: {
              danger: true,
            },
          });
        }}
      >
        <DeleteOutlined />
        Delete
      </Flex>
    </Flex>
  );
  return (
    <Flex className="archive-item" justify="space-between" align="center">
      <Flex gap={16}>
        <span className="archive-item__title">{list?.title}</span>/
        <span>{list?.cards.length} cards</span>
      </Flex>
      <Popover
        placement="bottomLeft"
        content={content}
        title={
          <Flex justify="space-between" align="center">
            <Flex>Actions</Flex>
            <CloseOutlined onClick={hide} />
          </Flex>
        }
        trigger="click"
        arrow={false}
        open={open}
        onOpenChange={() => handleShowPop()}
      >
        <MoreOutlined className="archive-item__more" />
      </Popover>
    </Flex>
  );
};

export default ArchiveItem;
