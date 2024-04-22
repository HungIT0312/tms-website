import {
  EllipsisOutlined,
  LeftOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Flex, Image, Tooltip } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import images from "../../../constants/images";
import AddMember from "../../Modal/AddMember/AddMember";
import "./BoardHeader.scss";
const BoardHeader = () => {
  const { selectedBoard } = useSelector((state) => state.board);
  const { userInformation } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const members = selectedBoard?.members;
  const isOwner = selectedBoard.members.some(
    (mem) =>
      mem.user.toString() === userInformation._id.toString() &&
      mem.role === "owner"
  );
  const renderMember = members.map((member) => {
    if (member.role === "owner") {
      return (
        <div
          key={member._id}
          className="owner"
          title={`${member.name + " " + member.surname} is the owner.`}
        >
          <Avatar style={{ background: `${member.color}`, fontSize: 10 }}>
            {member.name[0] + member.surname[0]}
          </Avatar>
          <span title="This member is the owner." className="owner__badge">
            <Image
              src={images.owner}
              alt="owner."
              title="This member is the owner."
              preview={false}
              width={9}
            />
          </span>
        </div>
      );
    } else if (member.role === "member") {
      return (
        <Tooltip
          key={member._id}
          title={member.name + " " + member.surname}
          placement="bottom"
          style={{ cursor: "pointer" }}
        >
          <Avatar
            style={{
              backgroundColor: member.color,
            }}
            icon={<UserOutlined />}
          >
            {member.name[0] + member.surname[0]}
          </Avatar>
        </Tooltip>
      );
    }
  });
  return (
    <div className="board-header">
      <Flex gap={8} align="center" className="board-header__title">
        <LeftOutlined
          size={32}
          onClick={() => navigate(-1)}
          className="board-header__back"
        />
        <span>{selectedBoard.title}</span>
      </Flex>
      <Flex justify="center" align="center" gap={8}>
        <Flex gap={8} className="filter-btn" align="center" justify="center">
          <img width={16} src={images.filterBoard} />
          <span>Filter</span>
        </Flex>
        <Divider
          type="vertical"
          style={{ color: "#fff", background: "#000" }}
        />
        <Flex
          gap={8}
          className="add-btn"
          align="center"
          justify="center"
          onClick={() => setIsOpen(true)}
        >
          <UserAddOutlined size={16} />
          <span>Add member</span>
        </Flex>
        <Avatar.Group maxCount={4}>{renderMember}</Avatar.Group>
        <EllipsisOutlined style={{ cursor: "pointer", fontSize: 24 }} />
      </Flex>
      <AddMember
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        board={selectedBoard}
        isOwner={isOwner}
      />
    </div>
  );
};

export default BoardHeader;
