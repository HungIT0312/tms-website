import { Button, Col, Flex, Image, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateBoard from "../../components/Modal/Board/CreateBoard";
import { emptyBoard } from "../../constants/images";
import { getAllUserBoard } from "../../stores/board/boardThunk";
import "./Workspace.scss";
import { LoadingOutlined } from "@ant-design/icons";
import BoardPreview from "../../components/Board/BoardPreview/BoardPreview";
const Workspace = () => {
  const [isOpenCreateModel, setIsOpenCreateModel] = useState(false);
  const { loading, boards } = useSelector((state) => state.board);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchBoard = async () => {
      await dispatch(getAllUserBoard());
    };
    fetchBoard();
  }, [dispatch]);

  return (
    <div className="workspace">
      <Flex justify="space-between" style={{ paddingBottom: 32 }}>
        <div style={{ fontSize: 24, fontWeight: 600 }}>Your workspace</div>
        <div>
          <Button type="primary" onClick={() => setIsOpenCreateModel(true)}>
            Create Board
          </Button>
        </div>
      </Flex>
      <div className="workspace__content">
        <Row gutter={[32, 32]} style={{ display: "flex" }}>
          {!loading && boards.length < 1 && (
            <Flex justify="center" align="center" vertical>
              <Image preview={false} src={emptyBoard} width={160}></Image>
              <span
                className="content__msg"
                style={{ marginTop: 24, fontWeight: 600 }}
              >
                You {"don't"} have any board here
              </span>
              <span
                className="content__msg"
                style={{ margin: 24, maxWidth: 500, textAlign: "center" }}
              >
                Create a new board, workspace to plan, track, and release great
                project with your team.
              </span>
              <Button type="primary" onClick={() => setIsOpenCreateModel(true)}>
                Create Board
              </Button>
            </Flex>
          )}
          {!loading &&
            boards &&
            boards.map((board) => (
              <Col key={board._id}>
                <BoardPreview board={board} />
              </Col>
            ))}
          {loading && <LoadingOutlined />}
        </Row>
      </div>
      <CreateBoard
        isOpen={isOpenCreateModel}
        showModal={setIsOpenCreateModel}
      />
    </div>
  );
};

export default Workspace;
