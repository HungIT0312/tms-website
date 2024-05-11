/* eslint-disable react/no-unescaped-entities */
import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import BoardContent from "../../components/Board/BoardContent/BoardContent";
import BoardHeader from "../../components/Board/BoardHeader/BoardHeader";
import BoardDrawer from "../../components/Drawer/BoardDrawer/BoardDrawer";
import { getBoard } from "../../stores/board/boardThunk";
import "./Board.scss";

const Board = () => {
  const dispatch = useDispatch();
  const { isLoading, selectedBoard } = useSelector((state) => state.board);
  const { boardId } = useParams();
  const [open, setOpen] = useState(false);
  const boardContainerRef = useRef(null);
  const [renderKey, setRenderKey] = useState("");

  const showDrawer = () => {
    setRenderKey("");
    setOpen(true);
  };
  const onClose = () => {
    setRenderKey("");
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getBoard(boardId));
  }, [boardId, dispatch]);

  return !isLoading ? (
    <div
      className="board"
      style={{
        background: `url(${selectedBoard.backgroundImageLink})  no-repeat center/cover`,
      }}
      ref={boardContainerRef}
    >
      <BoardHeader showDrawer={showDrawer} />
      <BoardContent />
      <Outlet />
      <BoardDrawer
        open={open}
        onClose={onClose}
        selectedBoard={selectedBoard}
        renderKey={renderKey}
        setRenderKey={setRenderKey}
      />
    </div>
  ) : (
    <Spin size="large" />
  );
};

export default Board;
