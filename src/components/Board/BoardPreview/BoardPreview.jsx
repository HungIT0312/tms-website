import { Image } from "antd";
import PropTypes from "prop-types";
import { taskBg } from "../../../constants/images";
import "./BoardPreview.scss";
const BoardPreview = ({ board }) => {
  return (
    <div
      style={{
        background: `url(${board.backgroundImageLink})  no-repeat center/cover`,
      }}
      className="BoardPreview__cover"
    >
      <Image className="image" src={taskBg} preview={false} />
      <span className="BoardPreview__title">{board.title}</span>
    </div>
  );
};
BoardPreview.propTypes = {
  board: PropTypes.object,
};
export default BoardPreview;
