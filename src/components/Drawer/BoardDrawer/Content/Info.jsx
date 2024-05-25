/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex } from "antd";
import { FiAlignLeft } from "react-icons/fi";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import boardProperty from "../../../../constants/boardProperty";
import { updateBoardInfo } from "../../../../stores/board/boardThunk";
import QuillTextBox from "../../../QuillTextBox/QuillTextBox";
import "./Info.scss";

const Info = ({ owner, selectedBoard }) => {
  const { userInformation } = useSelector((state) => state.user);
  const isMe = owner.user === userInformation._id.toString();
  const dispatch = useDispatch();

  const triggerCallUpdate = (value) => {
    const newDes = {
      boardId: selectedBoard?._id,
      newValue: value,
      property: boardProperty.DESCRIPTION,
    };
    dispatch(updateBoardInfo(newDes));
  };
  return (
    <Flex className="info" vertical gap={16}>
      <Flex vertical gap={12}>
        <Flex gap={12} className="info__header" align="center">
          <UserOutlined className="info__icon" />
          <span className="info__title">Chủ sỡ hữu</span>
        </Flex>
        <Flex className="" align="center" gap={12}>
          <div className="">
            <Avatar
              style={{ background: `${owner?.color}`, fontSize: 20 }}
              size={48}
            >
              {owner?.name[0] + owner?.surname[0]}
            </Avatar>
          </div>
          <Flex
            vertical
            className=""
            grow={1}
            basis={0}
            align="start"
            gap={4}
            justify="start"
          >
            <span className="info__name">
              {owner?.name + " " + owner?.surname}
            </span>
            <span className="info__mail">{owner?.email}</span>
            {isMe && <Link>Thay đổi thông tin</Link>}
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={12} vertical>
        <Flex gap={12} className="info__header" align="center">
          <FiAlignLeft className="info__icon" />
          <span className="info__title">Mô tả</span>
        </Flex>
        <QuillTextBox
          content={selectedBoard?.description || ""}
          placeholder={""}
          getCleanHTML={triggerCallUpdate}
        />
      </Flex>
    </Flex>
  );
};

export default Info;
