/* eslint-disable react/prop-types */
import { LockOutlined, TeamOutlined, UnlockOutlined } from "@ant-design/icons";
import { Avatar, Flex } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import images from "../../../constants/images";
import { capitalizeFirstLetter } from "../../../helpers/changeTitle";
import "./BoardPreview.scss";
import { useSelector } from "react-redux";
import { useState } from "react";

const BoardPreview = ({
  board,
  isMem = false,
  isLock = false,
  handleLockBoardSelected,
}) => {
  const navigate = useNavigate();
  const { userInformation } = useSelector((state) => state.user);
  const [isHovered, setIsHovered] = useState(false);

  const owner = board?.members?.find((member) => member.role === "owner");
  const isOwner = userInformation._id === owner.user;

  const handleChooseBoard = async (id) => {
    if (isLock) {
      handleLockBoardSelected(board, isOwner);
      return;
    }
    const slug = _.kebabCase(board.title.toLowerCase());
    navigate(`/board/${id}/${slug}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Flex
      className="BoardPreview"
      vertical
      onClick={() => handleChooseBoard(board._id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isLock && (
        <Flex className="BoardPreview__lock">
          {isHovered ? (
            <UnlockOutlined
              style={{
                fontSize: 54,
                color: "#5b5b5b",
              }}
            />
          ) : (
            <LockOutlined
              style={{
                fontSize: 54,
                color: "#5b5b5b",
              }}
            />
          )}
        </Flex>
      )}
      <Flex justify="center" align="center" className="BoardPreview__imgGroup">
        <img src={board.backgroundImageLink} className="BoardPreview__cover" />
        <img className="image" src={images.taskBg} />
        {!isLock && (
          <div className="BoardPreview__button-detail" type="primary">
            Xem chi tiết
          </div>
        )}
      </Flex>
      <Flex className="BoardPreview__content" vertical justify="center" gap={8}>
        <span className="BoardPreview__title">
          {capitalizeFirstLetter(board.title)}
        </span>
        {isMem && (
          <Flex className="BoardPreview__owner" align="center" gap={8}>
            <span>Chủ sở hữu:</span>
            <Avatar size={20} style={{ background: owner.color, fontSize: 8 }}>
              {owner.surname[0] + owner.name[0]}
            </Avatar>
            <span> {owner.surname + " " + owner.name}</span>
          </Flex>
        )}
        <span className="BoardPreview__members">
          <TeamOutlined />
          <span>{board.members.length}</span>
        </span>
      </Flex>
    </Flex>
  );
};

BoardPreview.propTypes = {
  board: PropTypes.object,
};

export default BoardPreview;
