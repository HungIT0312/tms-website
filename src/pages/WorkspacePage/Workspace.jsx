import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Image, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoardPreview from "../../components/Board/BoardPreview/BoardPreview";
import CreateBoard from "../../components/Modal/Board/CreateBoard";
import images from "../../constants/images";
import { getAllUserBoard } from "../../stores/board/boardThunk";
import "./Workspace.scss";
const Workspace = () => {
  const [isOpenCreateModel, setIsOpenCreateModel] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [input, setInput] = useState("");
  const { loading, boards } = useSelector((state) => state.board);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchBoard = async () => {
      await dispatch(getAllUserBoard());
    };
    fetchBoard();
  }, [dispatch]);
  useEffect(() => {
    const time = setTimeout(() => {
      setSearchKey(input);
    }, 500);

    return () => {
      clearTimeout(time);
    };
  }, [input]);
  const searchedBoard = boards?.filter((item) => {
    return item.title.toLowerCase().includes(searchKey.toLowerCase().trim());
  });
  return (
    <div className="workspace">
      <Flex justify="space-between" style={{ paddingBottom: 32 }}>
        <div className="workspace-title">Your workspace</div>
        <Flex gap={8}>
          <Input
            size="middle"
            placeholder="Search"
            prefix={<SearchOutlined />}
            className="workspace__search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="primary"
            className="workspace-create"
            onClick={() => setIsOpenCreateModel(true)}
          >
            Create Board
          </Button>
        </Flex>
      </Flex>
      <div className="workspace__content">
        <Row
          gutter={[32, 32]}
          // style={{ height: "100%", overflowY: "auto" }}
        >
          {!loading && boards.length < 1 && (
            <Flex justify="center" align="center" vertical>
              <Image
                preview={false}
                src={images.emptyBoard}
                width={160}
              ></Image>
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
            searchedBoard.map((board) => (
              <Col key={board._id} xs={24} sm={12} md={6} lg={6}>
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
