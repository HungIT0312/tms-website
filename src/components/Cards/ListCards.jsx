/* eslint-disable react/prop-types */
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Flex } from "antd";
import { useEffect, useRef } from "react";
import CardItem from "./CardItem/CardItem";
import "./ListCards.scss";

const ListCards = ({
  cards = [],
  newTaskTitle,
  setNewTaskTitle,
  isAddNewTask,
  setIsAddNewTask,
  handleAddNewTask,
}) => {
  const listCardsRef = useRef(null);

  useEffect(() => {
    if (isAddNewTask) {
      listCardsRef.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [isAddNewTask, cards]);

  const renderCards = cards.map((card) => (
    <CardItem key={card._id} card={card} />
  ));

  const handleAddCard = (value) => {
    setNewTaskTitle(value);
  };

  const cardIds = cards?.map(({ _id }) => _id);

  return (
    <SortableContext strategy={verticalListSortingStrategy} items={cardIds}>
      <Flex className="list-cards" vertical gap={8} ref={listCardsRef}>
        {renderCards}
        {isAddNewTask && (
          <CardItem
            isAdd={true}
            setNewTaskTitle={handleAddCard}
            newTaskTitle={newTaskTitle}
            setIsAddNewTask={setIsAddNewTask}
            handleAddNewTask={handleAddNewTask}
          />
        )}
      </Flex>
    </SortableContext>
  );
};

export default ListCards;
