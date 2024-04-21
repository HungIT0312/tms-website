import { Flex } from "antd";
import "./BoardContent.scss";
import ListColumns from "../../Lists/ListColumns";
const BoardContent = () => {
  return (
    <Flex className="board-content">
      <ListColumns />
    </Flex>
  );
};

export default BoardContent;
