import { Flex } from "antd";
import Column from "./Column/Column";
import './ListColumns.scss'
const ListColumns = () => {
  return (
    <Flex gap={12} className="list-columns">
      <Column />
      <Column />
      <Column />
      <Column />
      <Column />
      <Column />
      <button>add</button>
    </Flex>
  );
};

export default ListColumns;
