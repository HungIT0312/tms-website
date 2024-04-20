import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Divider, Flex, Image } from "antd";
import { useSelector } from "react-redux";
import images from "../../../constants/images";
import "./BoardHeader.scss";
const BoardHeader = () => {
  const { selectedBoard } = useSelector((state) => state.board);
  const { userInformation } = useSelector((state) => state.user);

  return (
    <div className="board-header">
      <Flex gap={8} align="center" className="board-header__title">
        <Image width={32} src={images.iconBoard} />
        {selectedBoard.title}
      </Flex>
      <Flex justify="center" align="center" gap={8}>
        <Flex gap={8} className="filter-btn">
          <img width={16} src={images.filterBoard} />
          <span>Filter</span>
        </Flex>
        <Divider
          type="vertical"
          style={{ color: "#fff", background: "#000" }}
        />
        <div className="owner" title="This member is the owner.">
          <Avatar
            size={"small"}
            style={{ background: `${userInformation.color}`, fontSize: 10 }}
          >
            {userInformation.name[0] + userInformation.surname[0]}
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
        <EllipsisOutlined style={{ cursor: "pointer", fontSize: 24 }} />
      </Flex>
    </div>
  );
};

export default BoardHeader;
