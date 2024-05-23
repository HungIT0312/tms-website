/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  changeListOrderByIds,
  createNewList,
  getAllListByBoardId,
  updateListInfo,
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
import { cloneDeep, isEmpty } from "lodash";
import { setCardsState, setListsState } from "../../../stores/list/ListSlice";
import { generatePlaceHolder } from "../../../utils/generatePlaceHolderCard";
import listProperty from "../../../constants/listProperty";

const BoardContent = ({ searchKey }) => {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const { loading, lists } = useSelector((state) => state.list);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldActiveColumn, setOldActiveColumn] = useState(null);
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
  // const moveCardBetweenDifferentColumns = (
  //   overColumn,
  //   overCardId,
  //   active,
  //   over,
  //   activeColumn,
  //   activeDraggingCardId,
  //   activeDraggingCardData
  // ) => {
  //   const overCardIndex = overColumn?.cards?.findIndex(
  //     (card) => card._id === overCardId
  //   );
  //   let newCardIndex;
  //   const isBelowOverItem =
  //     active.rect.current.translated &&
  //     active.rect.current.translated.top > over.rect.top + over.rect.height;
  //   const modifier = isBelowOverItem ? 1 : 0;
  //   newCardIndex =
  //     overCardIndex >= 0
  //       ? overCardIndex + modifier
  //       : overColumn?.cards?.length + 1;

  //   if (!oldActiveColumn || !overColumn) return;

  //   const nextColumns = cloneDeep(lists);
  //   const nextActiveColumns = nextColumns.find(
  //     (column) => column._id === oldActiveColumn._id
  //   );
  //   const nextOverColumns = nextColumns.find(
  //     (column) => column._id === overColumn._id
  //   );

  //   if (nextActiveColumns) {
  //     nextActiveColumns.cards = nextActiveColumns.cards.filter(
  //       (card) => card._id !== activeDraggingCardId
  //     );
  //   }
  //   if (nextOverColumns) {
  //     nextOverColumns.cards = nextOverColumns.cards || [];
  //     nextOverColumns.cards = nextOverColumns.cards.filter(
  //       (card) => card._id !== activeDraggingCardId
  //     );
  //     const newActiveDragItemData = {
  //       ...activeDraggingCardData,
  //       owner: nextOverColumns._id,
  //     };
  //     nextOverColumns.cards = nextOverColumns.cards.toSpliced(
  //       newCardIndex,
  //       0,
  //       newActiveDragItemData
  //     );
  //   }
  //   dispatch(setListsState(nextColumns));
  //   return {
  //     lists: nextColumns.map(({ _id }) => _id),
  //     parentListId: oldActiveColumn?._id,
  //     nextListId: nextOverColumns?._id,
  //     index: newCardIndex,
  //     cardId: activeDraggingCardId,
  //   };
  // };
  // boardId,
  //   sourceId,
  //   destinationId,
  //   destinationIndex,
  //   cardId,
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(event?.active?.data?.current?.typeDrag);
    setActiveDragItemData(event?.active?.data?.current);
    if (event?.active?.data?.current?.typeDrag == "card") {
      setOldActiveColumn(findColumnByCardId(event?.active?.id));
    }
  };
  // const handleDragOver = (event) => {
  //   const { active, over } = event;
  //   if (activeDragItemType === "list") return;
  //   if (!active || !over || !active.id || !over.id) return;

  //   const {
  //     id: activeDraggingCardId,
  //     data: { current: activeDraggingCardData },
  //   } = active;
  //   const { id: overCardId } = over;
  //   const overColumn = findColumnByCardId(overCardId);
  //   const activeColumn = findColumnByCardId(activeDraggingCardId);
  //   if (oldActiveColumn?._id === overColumn?.id) return;

  //   if (oldActiveColumn?._id !== overColumn?._id) {
  //     moveCardBetweenDifferentColumns(
  //       overColumn,
  //       overCardId,
  //       active,
  //       over,
  //       activeColumn,
  //       activeDraggingCardId,
  //       activeDraggingCardData
  //     );
  //   }
  // };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || !active.id || !over.id) return;

    if (activeDragItemType === "card") {
      const { id: overCardId } = over;
      const overColumn = findColumnByCardId(overCardId);
      if (!oldActiveColumn || !overColumn) return;

      if (oldActiveColumn._id == overColumn._id) {
        if (active.id !== over.id) {
          const oldIndex = oldActiveColumn?.cards?.findIndex(
            (c) => c._id === activeDragItemId
          );
          const newIndex = overColumn?.cards?.findIndex(
            (c) => c._id === over.id
          );
          const movedCards = arrayMove(
            oldActiveColumn?.cards,
            oldIndex,
            newIndex
          );
          const data = {
            listId: oldActiveColumn._id,
            cardIds: activeDragItemId,
            columnCards: movedCards,
          };
          const updateData = {
            boardId: boardId,
            listId: oldActiveColumn._id,
            value: movedCards?.map((c) => c._id),
            property: listProperty.CARDS,
          };
          dispatch(updateListInfo(updateData));
          dispatch(setCardsState(data));
          // }
        }
      }
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
        dispatch(setListsState(movedColumns));
        dispatch(changeListOrderByIds(data));
      }
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldActiveColumn(null);
  };

  const handleCreateList = (data) => {
    dispatch(createNewList({ ...data, boardId: boardId }));
  };
  const renderListsAfterSearch = lists?.map((list) => {
    const matchingCards = list?.cards.filter((card) =>
      card?.title.toLowerCase().includes(searchKey.toLowerCase())
    );
    return { ...list, cards: matchingCards };
  });

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      // onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Flex className="board-content">
        <ListColumns
          handleCreateList={handleCreateList}
          lists={renderListsAfterSearch}
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
            />
          )}
        </DragOverlay>
      </Flex>
    </DndContext>
  );
};

export default BoardContent;
