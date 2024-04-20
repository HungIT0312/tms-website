import { useEffect } from "react";
import "./Board.scss";
import { useDispatch, useSelector } from "react-redux";
import { getBoard } from "../../stores/board/boardThunk";
import { useParams } from "react-router-dom";
import BoardHeader from "../../components/Board/BoardHeader/BoardHeader";
const Board = () => {
  const dispatch = useDispatch();
  const { selectedBoard } = useSelector((state) => state.board);
  // id from params
  const { boardId } = useParams();
  useEffect(() => {
    dispatch(getBoard(boardId));
  }, [boardId, dispatch]);

  return (
    <div
      className="board"
      style={{
        background: `url(${selectedBoard.backgroundImageLink})  no-repeat center/cover`,
      }}
    >
      <BoardHeader />
      {/* <div>{selectedBoard.title}</div> */}
    </div>
  );
};

export default Board;
