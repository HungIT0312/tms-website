import { Flex } from "antd";
import CardItem from "./CardItem/CardItem";
import "./ListCards.scss";
const ListCards = () => {
  return (
    <Flex className="list-cards" vertical>
      <CardItem />
      <CardItem />
      <CardItem />
    </Flex>
  );
};

export default ListCards;
