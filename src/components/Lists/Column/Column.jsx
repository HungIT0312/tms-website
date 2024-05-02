/* eslint-disable react/prop-types */
import {
  CloseOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Popover } from "antd";
import { useEffect, useRef, useState } from "react";
import ListCards from "../../Cards/ListCards";
import "./Column.scss";
const Column = ({ isAddList = false, handleCreateList, list }) => {
  const [isAddNew, setIsAddNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const addNewRef = useRef(null);
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleShowPop = () => {
    setOpen(!open);
  };
  const content = (
    <Flex vertical gap={8}>
      <Flex className="pop__item">Change title</Flex>
      <Flex className="pop__item pop__item--delete">Delete</Flex>
    </Flex>
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addNewRef.current && !addNewRef.current.contains(event.target)) {
        setIsAddNew(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleCreate = () => {
    if (!newTitle) return;
    handleCreateList({ title: newTitle });
    setNewTitle("");
    setIsAddNew(false);
  };

  return isAddList ? (
    <Flex
      className={`List-column ${isAddNew ? "" : "List-column__add"}`}
      vertical
      ref={addNewRef}
    >
      {!isAddNew && (
        <Flex
          className="List-column__header"
          gap={8}
          align="center"
          onClick={() => setIsAddNew(true)}
        >
          <PlusOutlined />
          <span className="List-column__title">Add new List</span>
        </Flex>
      )}
      {isAddNew && (
        <>
          <Flex className="List-column__header" gap={8} align="center" vertical>
            <Input
              className="List-column__title"
              placeholder="Type new title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Flex>
          <Flex
            className="List-column__footer List-column__footer--add"
            gap={8}
            align="center"
          >
            <Button type="primary" className="btn-add" onClick={handleCreate}>
              Add
            </Button>
            <Button
              type="text"
              className="btn-add"
              onClick={() => setIsAddNew(false)}
            >
              Cancel
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  ) : (
    <Flex className="List-column" vertical>
      <Flex
        className="List-column__header"
        justify="space-between"
        align="center"
        gap={8}
      >
        <Flex className="List-column__title" flex={1}>
          {list?.title}
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
          onOpenChange={handleShowPop}
        >
          <EllipsisOutlined className="List-column__option" />
        </Popover>
      </Flex>
      <ListCards cards={list.cards} />
      <Flex className="List-column__footer" gap={8} align="center">
        <PlusOutlined />
        <span>Add new task</span>
      </Flex>
    </Flex>
  );
};

export default Column;
