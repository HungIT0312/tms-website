import { TeamOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import images from "../../../constants/images";
import { capitalizeFirstLetter } from "../../../helpers/changeTitle";
import "./BoardPreview.scss";

const BoardPreview = ({ board }) => {
  const navigate = useNavigate();
  const handleChooseBoard = async (id) => {
    const slug = _.kebabCase(board.title.toLowerCase());
    navigate(`/board/${id}/${slug}`);
  };
  return (
    <Flex
      className="BoardPreview"
      vertical
      onClick={() => handleChooseBoard(board._id)}
    >
      <Flex justify="center" align="center" className="BoardPreview__imgGroup">
        <img src={board.backgroundImageLink} className="BoardPreview__cover" />
        <img className="image" src={images.taskBg} />
        <div className="BoardPreview__button-detail" type="primary">
          Xem chi tiết
        </div>
      </Flex>
      <Flex className="BoardPreview__content" vertical>
        <span className="BoardPreview__title">
          {capitalizeFirstLetter(board.title)}
        </span>
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
