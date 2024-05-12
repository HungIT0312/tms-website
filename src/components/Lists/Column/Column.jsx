/* eslint-disable react/prop-types */
import {
  CloseOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Modal, Popover, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import ListCards from "../../Cards/ListCards";
import "./Column.scss";
import { useParams } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { addCard } from "../../../stores/card/cardThunk";
import { EditText } from "react-edit-text";
import { updateListInfo } from "../../../stores/list/ListThunk";
import listProperty from "../../../constants/listProperty";

const Column = ({ isAddList = false, handleCreateList, list }) => {
  const [isAddNew, setIsAddNew] = useState(false);
  const [isAddNewTask, setIsAddNewTask] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const addNewRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [listCard, setListCard] = useState([]);
  const { boardId } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

  //====================================================DND kit===============================================
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list?._id, data: { ...list, typeDrag: "list" } });

  const dndKitListStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : undefined,
    height: "100%",
  };
  useEffect(() => {
    setListCard(list?.cards);
    const handleClickOutside = (event) => {
      if (
        addNewRef.current &&
        !addNewRef.current.contains(event.target) &&
        !event.target.classList.contains("card-item__input") &&
        !event.target.classList.contains("List-column__footer--add")
      ) {
        setIsAddNewTask(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [list?.cards]);

  //====================================================Function===============================================
  const hide = () => {
    setOpen(false);
  };

  const handleShowPop = () => {
    setOpen(!open);
  };

  const handleCreate = () => {
    if (!newTitle) return;
    handleCreateList({ title: newTitle });
    setNewTitle("");
    setIsAddNew(false);
  };

  const handleAddNewTask = async () => {
    if (!newTaskTitle) return;
    const data = { title: newTaskTitle, listId: list._id, boardId: boardId };
    try {
      dispatch(addCard(data))
        .unwrap()
        .then((rs) => {
          setListCard([...listCard, rs.card]);
          api.success({
            message: rs.message,
            placement: "bottomRight",
          });
        });
    } catch (error) {
      api.error({
        message: error.errMessage,
        placement: "bottomRight",
      });
    }
    setNewTaskTitle("");
    setIsAddNewTask(false);
  };
  const handleListTitleChange = (data) => {
    const updateData = {
      boardId: boardId,
      listId: list._id,
      value: data.value,
      property: listProperty.TITLE,
    };
    dispatch(updateListInfo(updateData));
  };
  const handleListStateChange = () => {
    const updateData = {
      boardId: boardId,
      listId: list._id,
      value: true,
      property: listProperty.DESTROY,
    };
    dispatch(updateListInfo(updateData));
  };

  //====================================================render content===============================================
  const content = (
    <Flex vertical gap={8}>
      <Flex
        className="pop__item"
        onClick={(e) => {
          // editTitleRef.current.focus();
        }}
      >
        Change title
      </Flex>
      <Flex
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
            onOk: handleListStateChange,
            centered: true,
            content: "This list will be archived",
            okButtonProps: {
              danger: true,
            },
          });
        }}
      >
        Archive
      </Flex>
    </Flex>
  );
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
    <div ref={setNodeRef} style={dndKitListStyle} {...attributes}>
      <Flex className="List-column" vertical {...listeners}>
        {contextHolder}
        <Flex
          className="List-column__header"
          justify="space-between"
          align="center"
          gap={8}
        >
          <Flex className="List-column__title" flex={1}>
            <EditText
              name="title"
              defaultValue={list?.title}
              inline
              style={{ width: `100%` }}
              onSave={(value) => handleListTitleChange(value)}
              onChange={(e) => console.log(e)}
            />
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
        <ListCards
          cards={listCard}
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          isAddNewTask={isAddNewTask}
          setIsAddNewTask={setIsAddNewTask}
        />
        {/* add new task ======================================================================================*/}

        {!isAddNewTask && (
          <Flex
            className="List-column__footer"
            gap={8}
            align="center"
            onClick={() => setIsAddNewTask(true)}
          >
            <PlusOutlined />
            <span>Add new task</span>
          </Flex>
        )}
        {isAddNewTask && (
          <Flex
            className="List-column__footer List-column__footer--add"
            gap={8}
            align="center"
            ref={addNewRef}
          >
            <Button
              type="primary"
              className="btn-add"
              onClick={() => handleAddNewTask()}
            >
              Add
            </Button>
            <Button
              type="text"
              className="btn-cancel"
              onClick={() => setIsAddNewTask(false)}
            >
              Cancel
            </Button>
          </Flex>
        )}
      </Flex>
    </div>
  );
};

export default Column;
