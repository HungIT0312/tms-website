/* eslint-disable react/prop-types */
import { Flex, Spin } from "antd";
import Column from "./Column/Column";
import "./ListColumns.scss";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const ListColumns = ({ handleCreateList, lists, loading }) => {
  const renderLists = lists?.map((list) => (
    <Column key={list._id} list={list} />
  ));

  const loadingItem = loading
    ? { align: "center", justify: "center", style: { width: "100vw" } }
    : {};

  const arrId = lists?.map((l) => l._id);

  return (
    <SortableContext strategy={horizontalListSortingStrategy} items={arrId}>
      <Flex gap={12} className="list-columns" {...loadingItem}>
        {!loading && renderLists}
        {!loading && (
          <Column isAddList={true} handleCreateList={handleCreateList} />
        )}
        {loading && <Spin size="large" fullscreen />}
      </Flex>
    </SortableContext>
  );
};

export default ListColumns;
