/* eslint-disable react/prop-types */
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Flex, Skeleton } from "antd";
import Column from "./Column/Column";
import "./ListColumns.scss";

const ListColumns = ({ handleCreateList, lists, loading }) => {
  const renderLists = lists?.map((list) => (
    <Column key={list._id} list={list} />
  ));
  // const loadingItem = true
  //   ? { align: "center", justify: "center", style: { width: "100vw" } }
  //   : {};

  const arrId = lists?.map((l) => l._id);

  const renderLoadingSkeletons = () => (
    <>
      <Skeleton.Input active={loading} style={{ width: 200, height: 300 }} />
      <Skeleton.Input active={loading} style={{ width: 200, height: 250 }} />
      <Skeleton.Input active={loading} style={{ width: 200, height: 400 }} />
      <Skeleton.Input active={loading} style={{ width: 200, height: 400 }} />
    </>
  );

  return (
    <SortableContext strategy={horizontalListSortingStrategy} items={arrId}>
      <Flex gap={12} className="list-columns">
        {loading ? renderLoadingSkeletons() : renderLists}
        {!loading && (
          <Column isAddList={true} handleCreateList={handleCreateList} />
        )}

        {/* {true && <Spin size="large" style={{ margin: "0 auto" }} />} */}
      </Flex>
    </SortableContext>
  );
};

export default ListColumns;
