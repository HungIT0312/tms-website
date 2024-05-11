/* eslint-disable react/prop-types */
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Flex } from "antd";
import CardItem from "./CardItem/CardItem";
import "./ListCards.scss";
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
            // setModalOpen={setModalOpen}
          />
        )}
      </Flex>
    </SortableContext>
  );
};

export default ListCards;
