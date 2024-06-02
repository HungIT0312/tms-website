import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Image, Row, message } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bgColors, bgImages } from "../../../../constants/backgroundImage";
import boardProperty from "../../../../constants/boardProperty";
import images from "../../../../constants/images";
import { changeBg } from "../../../../stores/board/boardSlice";
import { updateBoardInfo } from "../../../../stores/board/boardThunk";

const Background = () => {
  const { selectedBoard } = useSelector((state) => state.board);
  const [bgLink, setBgLink] = useState(selectedBoard.backgroundImageLink);
  const { userInformation } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const isOwner = selectedBoard?.members?.some(
    (mem) =>
      mem.user.toString() === userInformation._id.toString() &&
      mem.role === "owner"
  );

  const handleOk = () => {
    const updateData = {
      boardId: selectedBoard?._id,
      newValue: bgLink,
      property: boardProperty.BACKGROUND,
    };
    dispatch(changeBg(bgLink));
    message.success("Thành công");
    dispatch(updateBoardInfo(updateData));
  };
  const handleChangeBg = (value) => {
    setBgLink(value);
  };

  const renderBg = (arr) => {
    const render = arr.map((item, index) => (
      <Col span={8} key={index}>
        <div
          className={`${bgLink !== item ? "bg-image" : "bg-image--active"}`}
          onClick={() => handleChangeBg(item)}
        >
          <Image width={64} height={40} preview={false} src={item} />
          <div className="bg-image--checked">
            <CheckOutlined color="#fff" />
          </div>
        </div>
      </Col>
    ));
    return render;
  };
  return (
    <Flex
      justify="center"
      align="center"
      vertical
      className="create-board"
      gap={24}
    >
      <label>{selectedBoard?.title}</label>
      <Flex vertical justify="center" align="center">
        <div
          className="create-board__preview"
          style={{
            background: `url(${bgLink})  no-repeat center/cover`,
          }}
        >
          <Image src={images.taskBg} preview={false} />
        </div>
      </Flex>

      <Flex
        vertical
        justify="center"
        align="center"
        style={{
          pointerEvents: !isOwner && "none",
        }}
      >
        <div style={{ width: 200 }}>
          <Row gutter={[8, 8]}>{renderBg(bgImages)}</Row>
        </div>
        <div style={{ width: 200, marginTop: 8 }}>
          <Row gutter={[8, 8]}>{renderBg(bgColors)}</Row>
        </div>
      </Flex>
      <Flex gap={8}>
        <Button
          type="primary"
          disabled={!isOwner}
          title="Chỉ chủ sỡ hữu mới có thể chỉnh sửa"
          onClick={handleOk}
        >
          Thay đổi
        </Button>
        {/* <Button>Hủy</Button> */}
      </Flex>
    </Flex>
  );
};

export default Background;
