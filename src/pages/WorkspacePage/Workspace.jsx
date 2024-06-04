import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Skeleton,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoardPreview from "../../components/Board/BoardPreview/BoardPreview";
import CreateBoard from "../../components/Modal/Board/CreateBoard";
import images from "../../constants/images";
import { getAllUserBoard } from "../../stores/board/boardThunk";
import "./Workspace.scss";
import { lockBoard } from "../../api/board/board.api";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const Workspace = () => {
  const [isOpenCreateModel, setIsOpenCreateModel] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [input, setInput] = useState("");
  const { isLoading, boards, storageBoards } = useSelector(
    (state) => state.board
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const [board, setBoard] = useState({});
  const { userInformation } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const handleLockBoardSelected = (value, isOwner) => {
    if (isOwner) {
      setIsOpen(true);
      setBoard(value);
    } else {
      Modal.info({
        title: "Thông báo",
        content:
          "Bạn không có quyền tham gia dự án này. Hãy liên hệ với chủ sở hữu hoặc admin để truy cập",
        centered: true,
      });
    }
  };
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
  const handleInputChange = async (e) => {
    const value = e.target.value;
    await setIsConfirmDisabled(value.trim() !== board?.title.trim());
  };
  const content = (
    <Flex vertical>
      <p>
        Mở lại dự án, các thành viên có thể làm việc trở lại trên dự án này như
        bình thường.
      </p>
      <Form layout="vertical">
        <Form.Item
          label={
            <p>
              Hãy nhập lại tên dự án
              <span
                style={{
                  background: "#eee",
                  padding: 4,
                  margin: 4,
                  borderRadius: 4,
                }}
              >
                {board.title}
              </span>
              để mở khóa
            </p>
          }
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề bảng!" }]}
        >
          <Input
            id="lock-board-input"
            type="text"
            onChange={handleInputChange}
          ></Input>
        </Form.Item>
      </Form>
    </Flex>
  );
  const lockBoardById = async () => {
    try {
      const data = {
        boardId: board?._id,
        isLocked: false,
      };
      await lockBoard(data);
    } catch (error) {
      console.log(error);
    }
  };
  const onClose = () => {
    setIsOpen(false);
  };
  const handleLockBoard = async () => {
    const input = document.getElementById("lock-board-input").value;
    if (input !== board.title) {
      message.error("Tên dự án không đúng");
      return;
    }
    message.success("Dự án đã được mở ");
    onClose();
    lockBoardById();
    const slug = _.kebabCase(board.title.toLowerCase());
    navigate(`/board/${board?._id}/${slug}`);
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
        <Row gutter={[16, 16]}>
          <Divider orientation="left" orientationMargin={12}>
            <div className="workspace-title" style={{ border: "none" }}>
              Dự án đang tạm dừng
            </div>
          </Divider>
          {!isLoading && searchedBoard("owner", true)?.length < 1 && (
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
            storageBoards?.length > 0 &&
            searchedBoard("", true).map((board) => (
              <Col key={board._id} xs={24} sm={12} md={6} lg={4}>
                <BoardPreview
                  isMem={true}
                  isLock={true}
                  board={board}
                  handleLockBoardSelected={handleLockBoardSelected}
                />
              </Col>
            ))}
        </Row>
      </Flex>
      <CreateBoard
        isOpen={isOpenCreateModel}
        showModal={setIsOpenCreateModel}
      />
      <Modal
        open={isOpen}
        title="Bạn có muốn xác nhận mở lại dự án không?"
        okText="Xác nhận"
        cancelText="Hủy"
        centered={true}
        onOk={handleLockBoard}
        onCancel={onClose}
        okButtonProps={{
          disabled: isConfirmDisabled,
        }}
      >
        {content}
      </Modal>
    </div>
  );
};

export default Workspace;
