import { TeamOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { taskBg } from "../../../constants/images";
import { capitalizeFirstLetter } from "../../../helpers/changeTitle";
import "./BoardPreview.scss";

const BoardPreview = ({ board }) => {
  const navigate = useNavigate();
  const handleChooseBoard = async (id) => {
    const slug = _.kebabCase(board.title.toLowerCase());
    navigate(`/board/${id}/${slug}`);
  };
  return (
    <Flex className="BoardPreview" vertical>
      <Flex
        style={{ position: "relative" }}
        justify="center"
        align="center"
        className="BoardPreview__imgGroup"
        onClick={() => handleChooseBoard(board._id)}
      >
        <img src={board.backgroundImageLink} className="BoardPreview__cover" />
        <img className="image" src={taskBg} />
        <div className="BoardPreview__button-detail" type="primary">
          See Detail
        </div>
      </Flex>

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
