/* eslint-disable react/prop-types */
import { Flex } from "antd";
import { useSelector } from "react-redux";
import Column from "./Column/Column";
import "./ListColumns.scss";
const ListColumns = ({ handleCreateList }) => {
  const { lists } = useSelector((state) => state.list);
  const renderLists = lists?.map((list) => (
    <Column key={list._id} list={list} />
  ));

  return (
    <Flex gap={12} className="list-columns">
      {renderLists}
      <Column isAddList={true} handleCreateList={handleCreateList} />
    </Flex>
  );
};

export default ListColumns;
