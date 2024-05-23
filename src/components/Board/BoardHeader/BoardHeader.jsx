/* eslint-disable react/prop-types */
import {
  BarChartOutlined,
  EllipsisOutlined,
  LeftOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Flex, Image, Input, Popover, Tooltip } from "antd";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../../../constants/images";
import AddMember from "../../Modal/AddMember/AddMember";
import "./BoardHeader.scss";

import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import boardProperty from "../../../constants/boardProperty";
import { updateBoardInfo } from "../../../stores/board/boardThunk";
import Analysis from "../../Modal/Analysis/Analysis";
import BoardFilter from "../../Popup/Filter/BoardFilter";
const BoardHeader = ({ showDrawer, handleSearch, searchKey }) => {
  const { selectedBoard } = useSelector((state) => state.board);
  const { userInformation } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const rootLink = location.pathname?.split("/").slice(0, 1).join("/") + "/";
  const members = selectedBoard.members || [];
  const inputRef = useRef(null);
  const isOwner = selectedBoard?.members?.some(
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
  //===========================================================================
  const handleBoardTitleChange = (data) => {
    const updateData = {
      boardId: selectedBoard?._id,
      newValue: data.value,
      property: boardProperty.TITLE,
    };
    dispatch(updateBoardInfo(updateData));
  };

  const onSearch = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };
  return (
    <div className="board-header">
      <Flex gap={8} align="center" className="board-header__title">
        <LeftOutlined
          size={32}
          onClick={() => navigate(rootLink)}
          className="board-header__back"
        />
        <EditText
          name="title"
          defaultValue={selectedBoard.title}
          inline
          style={{ width: `${selectedBoard?.title?.length}ch` }}
          onSave={(value) => handleBoardTitleChange(value)}
        />
      </Flex>
      <Flex justify="center" align="center" gap={8}>
        <Popover
          placement="bottom"
          title="Find Tasks"
          content={
            <Input
              placeholder="input search text"
              onChange={onSearch}
              className="header__search"
              ref={inputRef}
              value={searchKey}
            />
          }
          onOpenChange={() => {
            handleSearch("");
          }}
          afterOpenChange={() => {
            handleSearch("");
          }}
          arrow={false}
          trigger={"click"}
        >
          <Flex gap={8} className="filter-btn" align="center" justify="center">
            <SearchOutlined />
            <span>Find</span>
          </Flex>
        </Popover>
        <Divider
          type="vertical"
          style={{ color: "#fff", background: "#000" }}
        />
        <Flex
          gap={8}
          className="filter-btn"
          align="center"
          justify="center"
          onClick={() => {
            setIsOpenModal(true);
          }}
        >
          <BarChartOutlined className="" />
          <span className="">Analysis</span>
        </Flex>
        <Divider
          type="vertical"
          style={{ color: "#fff", background: "#000" }}
        />
        <Popover
          placement="bottom"
          title={"Filter"}
          content={<BoardFilter />}
          arrow={false}
          trigger={"click"}
        >
          <Flex gap={8} className="filter-btn" align="center" justify="center">
            <img width={16} src={images.filterBoard} />
            <span>Filter</span>
          </Flex>
        </Popover>
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
        <EllipsisOutlined
          style={{ cursor: "pointer", fontSize: 24 }}
          onClick={showDrawer}
        />
      </Flex>
      <AddMember
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        board={selectedBoard}
        isOwner={isOwner}
      />
      {isOpenModal && (
        <Analysis isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
      )}
    </div>
  );
};

export default BoardHeader;
