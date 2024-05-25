import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Flex, Image, Input, Row, Skeleton } from "antd";
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
  const { isLoading, boards } = useSelector((state) => state.board);
  const { userInformation } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBoard = async () => {
      await dispatch(getAllUserBoard());
    };
    fetchBoard();
  }, [dispatch, userInformation._id]);

  useEffect(() => {
    const time = setTimeout(() => {
      setSearchKey(input);
    }, 500);

    return () => {
      clearTimeout(time);
    };
  }, [input]);

  const renderBoards = (role) => {
    return (
      boards &&
      boards.filter((board) => {
        return board?.members.some(
          (member) =>
            member.user.toString() === userInformation._id.toString() &&
            member.role === role
        );
      })
    );
  };

  const searchedBoard = (role) => {
    const boards = renderBoards(role);
    return boards.filter((item) => {
      return item?.title.toLowerCase().includes(searchKey.toLowerCase().trim());
    });
  };

  const renderSkeletons = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <Col key={index} xs={24} sm={12} md={6} lg={4}>
        <Skeleton.Button
          active={isLoading}
          style={{ height: "200px", width: "240px" }}
        />
      </Col>
    ));
  };

  return (
    <div className="workspace">
      <Flex justify="space-between" style={{ paddingBottom: 32 }}>
        <div className="workspace-title">Không gian làm việc của bạn</div>
        <Flex gap={8}>
          <Input
            size="middle"
            placeholder="Tìm kiếm"
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
            Tạo bảng mới
          </Button>
        </Flex>
      </Flex>
      <div className="workspace__content">
        <Row gutter={[16, 16]}>
          {!isLoading && boards?.length < 1 && (
            <Flex
              style={{ width: "100vw" }}
              justify="center"
              align="center"
              vertical
            >
              <Image
                preview={false}
                src={images.emptyBoard}
                width={160}
              ></Image>
              <span
                className="content__msg"
                style={{ marginTop: 24, fontWeight: 600 }}
              >
                Bạn không có bảng nào ở đây
              </span>
              <span
                className="content__msg"
                style={{ margin: 24, maxWidth: 500, textAlign: "center" }}
              >
                Tạo một bảng, không gian làm việc mới để lập kế hoạch, theo dõi
                và quản lý dự án cùng nhóm của bạn.
              </span>
              <Button type="primary" onClick={() => setIsOpenCreateModel(true)}>
                Tạo bảng
              </Button>
            </Flex>
          )}
          {isLoading && renderSkeletons(4)}
          {!isLoading &&
            boards?.length > 0 &&
            searchedBoard("owner").map((board) => (
              <Col key={board._id} xs={24} sm={12} md={6} lg={4}>
                <BoardPreview board={board} />
              </Col>
            ))}
          <Divider orientation="left" orientationMargin={12}>
            <div className="workspace-title" style={{ border: "none" }}>
              Không gian làm việc đang tham gia
            </div>
          </Divider>
          {isLoading && renderSkeletons(4)}
          {!isLoading &&
            boards?.length > 0 &&
            searchedBoard("member").map((board) => (
              <Col key={board._id} xs={24} sm={12} md={6} lg={4}>
                <BoardPreview board={board} />
              </Col>
            ))}
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
