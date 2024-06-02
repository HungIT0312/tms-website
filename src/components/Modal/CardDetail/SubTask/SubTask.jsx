/* eslint-disable react/prop-types */
import { SisternodeOutlined } from "@ant-design/icons";
import { Avatar, Flex, Tag, Tooltip } from "antd";
import "./SubTask.scss";
const SubTask = ({ task, handleClick = () => {} }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      className="subtask"
      onClick={() => handleClick(task)}
    >
      <Flex gap={8}>
        <SisternodeOutlined className="subtask__icon" />
        <span className="subtask__title">{task?.title}</span>
      </Flex>
      <Flex gap={16} align="center" justify="center">
        {task?.date?.completed ? (
          <Tag bordered={false} color="green">
            Hoàn thành
          </Tag>
        ) : (
          <Tag bordered={false} color="red">
            Chưa giải quyết
          </Tag>
        )}

        {task?.members?.length > 0 ? (
          <Tooltip title={task?.members[0]?.user?.fullName} placement="bottom">
            <Avatar
              size={20}
              style={{
                fontSize: 9,
                background: task?.members[0]?.color,
              }}
            >
              {task?.members[0]?.surname[0] + task?.members[0]?.name[0]}
            </Avatar>
          </Tooltip>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
};

export default SubTask;
