import { Flex } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createNewList,
  getAllListByBoardId,
} from "../../../stores/list/ListThunk";
import ListColumns from "../../Lists/ListColumns";
import "./BoardContent.scss";
const BoardContent = () => {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  useEffect(() => {
    dispatch(getAllListByBoardId(boardId));
    return () => {};
  }, [boardId, dispatch]);
  const handleCreateList = (data) => {
    dispatch(createNewList({ ...data, boardId: boardId }));
  };
  return (
    <Flex className="board-content">
      <ListColumns handleCreateList={handleCreateList} />
    </Flex>
  );
};

export default BoardContent;
