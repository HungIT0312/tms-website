import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Flex, Image, Input, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { FiArchive } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import BoardPreview from "../../components/Board/BoardPreview/BoardPreview";
import CreateBoard from "../../components/Modal/Board/CreateBoard";
import StorageBoard from "../../components/Modal/StorageBoard/StorageBoard";
import images from "../../constants/images";
import { getAllUserBoard } from "../../stores/board/boardThunk";
import "./Workspace.scss";

const Workspace = () => {
  const [isOpenCreateModel, setIsOpenCreateModel] = useState(false);
  const [isOpenStorage, setIsOpenStorage] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [input, setInput] = useState("");
  const { isLoading, boards, storageBoards } = useSelector(
    (state) => state.board
  );
  const { userInformation } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(boards);
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

  const searchedBoard = (role, isLock = false) => {
    if (isLock) {
      return storageBoards.filter((item) => {
        return item?.title
          .toLowerCase()
          .includes(searchKey.toLowerCase().trim());
      });
    }
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
          style={{ height: "200px", width: "calc(100vw / 6 - 24px)" }}
        />
      </Col>
    ));
  };

  return (
    <div className="workspace">
      <Flex justify="space-between" style={{ paddingBottom: 32 }}>
        <div className="workspace-title">Dự án quản lý</div>
        <Flex gap={8}>
          <Input
            size="middle"
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            className="workspace__search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            allowClear
          />
          <Button
            type="primary"
            className="workspace-create"
            onClick={() => setIsOpenCreateModel(true)}
          >
            Tạo bảng mới
          </Button>
          <Button
            type=""
            className="workspace-create"
            style={{
              color: "#2a86ff",
            }}
            onClick={() => setIsOpenStorage(true)}
            icon={<FiArchive className="" />}
          >
            Bảng đã khóa
          </Button>
        </Flex>
      </Flex>
      <Flex className="workspace__content" vertical>
        <Row gutter={[16, 16]}>
          {!isLoading && searchedBoard("owner")?.length < 1 && (
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
          {isLoading && renderSkeletons(6)}
          {!isLoading &&
            boards?.length > 0 &&
            searchedBoard("owner").map((board) => (
              <Col key={board._id} xs={26} sm={12} md={6} lg={4}>
                <BoardPreview board={board} />
              </Col>
            ))}
        </Row>
        <Row gutter={[16, 16]}>
          <Divider orientation="left" orientationMargin={12}>
            <div className="workspace-title" style={{ border: "none" }}>
              Dự án tham gia
            </div>
          </Divider>
          {!isLoading && searchedBoard("member")?.length < 1 && (
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
            </Flex>
          )}
          {isLoading && renderSkeletons(6)}
          {!isLoading &&
            boards?.length > 0 &&
            searchedBoard("member").map((board) => (
              <Col key={board._id} xs={24} sm={12} md={6} lg={4}>
                <BoardPreview isMem={true} board={board} />
              </Col>
            ))}
        </Row>
      </Flex>
      <CreateBoard
        isOpen={isOpenCreateModel}
        showModal={setIsOpenCreateModel}
      />

      <StorageBoard isOpen={isOpenStorage} setIsOpen={setIsOpenStorage} />
    </div>
  );
};

export default Workspace;
