import { Flex } from "antd";
import ListCards from "../../Cards/ListCards";
import "./Column.scss";
const Column = () => {
  return (
    <Flex className="column" vertical>
      <div className="column__title">Hung</div>
      <ListCards />
    </Flex>
  );
};

export default Column;
