import { TeamOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { taskBg } from "../../../constants/images";
import { capitalizeFirstLetter } from "../../../helpers/changeTitle";
import "./BoardPreview.scss";
const BoardPreview = ({ board }) => {
  const navigate = useNavigate();
  const handleChooseBoard = async (id) => {
    navigate(`/board/${id}/${board.title.toLowerCase()}`);
  };
  return (
    <Flex className="BoardPreview" vertical>
      <div
        style={{
          background: `url(${board.backgroundImageLink})  no-repeat center/cover`,
        }}
        className="BoardPreview__cover"
        onClick={() => handleChooseBoard(board._id)}
      >
        <img className="image" src={taskBg} />
        <div className="BoardPreview__button-detail" type="primary">
          See Detail
        </div>
      </div>
      <span
        className="BoardPreview__title"
        onClick={() => handleChooseBoard(board._id)}
      >
        {capitalizeFirstLetter(board.title)}
      </span>
      <span className="BoardPreview__members">
        <TeamOutlined />
        <span>{board.members.length}</span>
      </span>
    </Flex>
  );
};
BoardPreview.propTypes = {
  board: PropTypes.object,
};
export default BoardPreview;
