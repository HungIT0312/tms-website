import { useEffect } from "react";
import "./Board.scss";
import { useDispatch, useSelector } from "react-redux";
import { getBoard } from "../../stores/board/boardThunk";
import { useParams } from "react-router-dom";
import BoardHeader from "../../components/Board/BoardHeader/BoardHeader";
import BoardContent from "../../components/Board/BoardContent/BoardContent";
import { Spin } from "antd";
const Board = () => {
  const dispatch = useDispatch();
  const { isLoading, selectedBoard } = useSelector((state) => state.board);
  const { boardId } = useParams();
  useEffect(() => {
    dispatch(getBoard(boardId));
  }, [boardId, dispatch]);
  return (
    <>
      {!isLoading && (
        <div
          className="board"
          style={{
            background: `url(${selectedBoard.backgroundImageLink})  no-repeat center/cover`,
          }}
        >
          <BoardHeader />
          <BoardContent />
        </div>
      )}
      {isLoading && <Spin size="large" />}
    </>
  );
};

export default Board;
