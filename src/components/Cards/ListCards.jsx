/* eslint-disable react/prop-types */
import { Flex } from "antd";
import CardItem from "./CardItem/CardItem";
import "./ListCards.scss";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
const ListCards = ({
  cards = [],
  newTaskTitle,
  setNewTaskTitle,
  isAddNewTask,
  setIsAddNewTask,
}) => {
  const renderCards = cards.map((card) => (
    <CardItem key={card._id} card={card} />
  ));
  const handleAddCard = (value) => {
    setNewTaskTitle(value);
  };
  const cardIds = cards?.map(({ _id }) => _id);
  return (
    <SortableContext strategy={verticalListSortingStrategy} items={cardIds}>
      <Flex className="list-cards" vertical gap={8}>
        {renderCards}
        {isAddNewTask && (
          <CardItem
            isAdd={true}
            setNewTaskTitle={handleAddCard}
            newTaskTitle={newTaskTitle}
            setIsAddNewTask={setIsAddNewTask}
          />
        )}
      </Flex>
    </SortableContext>
  );
};

export default ListCards;
