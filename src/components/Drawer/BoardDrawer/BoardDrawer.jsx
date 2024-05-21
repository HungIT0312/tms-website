/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import {
  InfoCircleOutlined,
  MinusOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Button, Divider, Drawer, Flex, Image } from "antd";
import { FiArchive } from "react-icons/fi";
import "./BoardDrawer.scss";
import Activities from "./Content/Activities";
import Archive from "./Content/Archive";
import Info from "./Content/Info";
import { useSelector } from "react-redux";
const BoardDrawer = ({
  open,
  onClose,
  selectedBoard = {},
  renderKey,
  setRenderKey,
}) => {
  const owner = (selectedBoard.members || []).filter(
    (member) => member.role === "owner"
  )[0];
  const { userInformation } = useSelector((state) => state.user);
  const renderDrawerContent = (child) => {
    return (
      <Flex vertical gap={8}>
        <Flex
          gap={12}
          className="drawer-item"
          align="start"
          onClick={() => setRenderKey("info")}
        >
          <InfoCircleOutlined className="drawer-item__icon" />
          <Flex vertical>
            <span className="drawer-item__name">About this board</span>
            <span className="drawer-item__sub">Add board's description</span>
          </Flex>
        </Flex>
        <Flex
          gap={12}
          className="drawer-item"
          align="center"
          onClick={() => setRenderKey("activity")}
        >
          <ProjectOutlined className="drawer-item__icon" />
          <Flex vertical>
            <span className="drawer-item__name">Activities</span>
          </Flex>
        </Flex>
        <Flex
          gap={12}
          className="drawer-item"
          align="center"
          onClick={() => setRenderKey("bg")}
        >
          <Image
            src={selectedBoard.backgroundImageLink}
            width={20}
            height={20}
            style={{ borderRadius: 4 }}
          />
          <Flex vertical>
            <span className="drawer-item__name">Change background</span>
          </Flex>
        </Flex>
        <Divider />

        <Flex
          gap={12}
          className="drawer-item"
          align="center"
          onClick={() => setRenderKey("archive")}
        >
          <FiArchive className="drawer-item__icon" />
          <Flex vertical>
            <span className="drawer-item__name">Archive lists</span>
          </Flex>
        </Flex>
        {owner?.user == userInformation?._id && (
          <Flex
            gap={12}
            className="drawer-item"
            align="center"
            // onClick={() => setRenderKey("setting")}
          >
            <MinusOutlined className="drawer-item__icon" />
            <Flex vertical>
              <span className="drawer-item__name">Close the Board</span>
            </Flex>
          </Flex>
        )}

        {child && child}
      </Flex>
    );
  };
  return (
    <Drawer
      title="Menu"
      placement="right"
      onClose={onClose}
      open={open}
      getContainer={".board"}
      extra={
        renderKey !== "" &&
        renderKey !== "analysis" && (
          <Flex>
            <Button type="text" onClick={() => setRenderKey("")}>
              Back
            </Button>
          </Flex>
        )
      }
    >
      {renderKey === "" && renderDrawerContent(<></>)}
      {renderKey === "info" && (
        <Info owner={owner} selectedBoard={selectedBoard} />
      )}
      {renderKey === "activity" && <Activities selectedBoard={selectedBoard} />}
      {renderKey === "archive" && <Archive />}
    </Drawer>
  );
};

export default BoardDrawer;
