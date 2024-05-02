/* eslint-disable react/prop-types */
import { Flex } from "antd";
import CardItem from "./CardItem/CardItem";
import "./ListCards.scss";
const ListCards = ({ cards = [] }) => {
  const renderCards = cards.map((card) => (
    <CardItem key={card._id} card={card} />
  ));
  return (
    <Flex className="list-cards" vertical gap={8}>
      {renderCards}
    </Flex>
  );
};

export default ListCards;
