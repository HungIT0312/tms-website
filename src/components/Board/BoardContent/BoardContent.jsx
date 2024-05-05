import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  changeListOrderByIds,
  createNewList,
  getAllListByBoardId,
} from "../../../stores/list/ListThunk";
import ListColumns from "../../Lists/ListColumns";
import "./BoardContent.scss";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "../../Lists/Column/Column";
import CardItem from "../../Cards/CardItem/CardItem";
import { cloneDeep } from "lodash";
import { setListsState } from "../../../stores/list/ListSlice";

const BoardContent = () => {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const { loading, lists } = useSelector((state) => state.list);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  useEffect(() => {
    dispatch(getAllListByBoardId(boardId));
  }, [boardId, dispatch]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5,
        },
      },
    }),
  };
  const findColumnByCardId = (cardId) => {
    return lists.find((column) => column.cards.some((c) => c._id === cardId));
  };
  const handleDragStart = (event) => {
    setActiveDragItem(event?.active?.id);
    setActiveDragItemType(event?.active?.data?.current?.typeDrag);
    setActiveDragItemData(event?.active?.data?.current);
  };
  const handleDragOver = (event) => {
    if (activeDragItemType === "list") return;
    const { active, over } = event;
    if (!active || !over) return;
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    const overCardIndex = overColumn?.cards?.findIndex(
      (card) => card._id === overCardId
    );
    let newCardIndex;
    const isBelowOverItem =
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height;
    const modifier = isBelowOverItem ? 1 : 0;
    newCardIndex =
      overCardIndex >= 0
        ? overCardIndex + modifier
        : overColumn?.cards?.length + 1;
    if (!activeColumn || !overColumn) return;

    const nextColumns = cloneDeep(lists);
    const nextActiveColumns = nextColumns.find(
      (column) => column._id === activeColumn._id
    );
    const nextOverColumns = nextColumns.find(
      (column) => column._id === overColumn._id
    );

    if (nextActiveColumns) {
      nextActiveColumns.cards = nextActiveColumns.cards.filter(
        (card) => card._id !== activeDraggingCardId
      );
      // nextActiveColumns
    }
    if (nextOverColumns) {
      nextOverColumns.cards = nextOverColumns.cards || [];
      nextOverColumns.cards = nextOverColumns.cards.filter(
        (card) => card._id !== activeDraggingCardId
      );
      nextOverColumns.cards.splice(newCardIndex, 0, activeDraggingCardData);
    }
    // console.log("nextColumn", nextColumns);
    dispatch(setListsState(nextColumns));
    // if (activeColumn?._id === overColumn?._id) return;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    if (!active.id && !over.id) return;

    if (activeDragItemType === "card") {
      if (active.id !== over.id) {
        console.log("nothing");
      }
      return;
    }
    if (activeDragItemType === "list") {
      if (active.id !== over.id) {
        const oldIndex = lists?.findIndex((c) => c._id === active.id);
        const newIndex = lists?.findIndex((c) => c._id === over.id);
        const movedColumns = arrayMove(lists, oldIndex, newIndex);
        const movedColumnIds = movedColumns?.map(({ _id }) => _id);
        const data = {
          boardId: boardId,
          listIds: movedColumnIds,
        };
        dispatch(changeListOrderByIds(data));
        dispatch(setListsState(movedColumns));
      }
    }

    setActiveDragItem(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  const handleCreateList = (data) => {
    dispatch(createNewList({ ...data, boardId: boardId }));
  };
  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Flex className="board-content">
        <ListColumns
          handleCreateList={handleCreateList}
          lists={lists}
          loading={loading}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === "list" && (
            <Column handleCreateList={() => {}} list={activeDragItemData} />
          )}
          {activeDragItemType === "card" && (
            <CardItem
              card={activeDragItemData}
              isAdd={false}
              setNewTaskTitle={() => {}}
              newTaskTitle={""}
              setIsAddNewTask={() => {}}
            />
          )}
        </DragOverlay>
      </Flex>
    </DndContext>
  );
};

export default BoardContent;
