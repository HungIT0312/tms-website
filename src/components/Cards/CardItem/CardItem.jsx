/* eslint-disable react/prop-types */
import {
  BorderOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Tooltip } from "antd";
import { useState } from "react";
import "./CardItem.scss";
const CardItem = ({ card = {} }) => {
  const [isEnter, setIsEnter] = useState(false);
  return (
    <Flex className="card-item" vertical>
      <div className="card-item__cover"></div>
      <Flex vertical gap={4}>
        <Flex className="card-item__labels" gap={8}>
          <span className="card-item__label card-item__label--red"></span>
          <span className="card-item__label card-item__label--blue"></span>
          <span className="card-item__label card-item__label--yellow"></span>
        </Flex>
        <div className="card-item__title">{card?.title}</div>
        <Flex className="card-item__content" wrap="wrap" align="center" gap={8}>
          <Flex gap={8} align="center" wrap="wrap" style={{ height: 28 }}>
            <Flex align="center" className="card-item__content-item">
              <EyeOutlined />
            </Flex>
            <Flex
              align="center"
              className="checkbox-due"
              gap={3}
              onMouseEnter={() => setIsEnter(true)}
              onMouseLeave={() => setIsEnter(false)}
            >
              {isEnter ? (
                <BorderOutlined size={12} />
              ) : (
                <ClockCircleOutlined size={12} />
              )}
              <span>1/5/2024</span>
            </Flex>
            <Flex align="center" gap={3} className="card-item__content-item">
              <PaperClipOutlined />
              <span>2</span>
            </Flex>
            <Flex align="center" gap={3} className="card-item__content-item">
              <MessageOutlined />
              <span>2</span>
            </Flex>
            <Flex gap={3} align="center" className="card-item__content-item">
              <CheckSquareOutlined />
              <span>2/4</span>
            </Flex>
          </Flex>
          <Flex align="center" justify="end" flex={1}>
            <Avatar.Group
              maxCount={3}
              maxStyle={{
                color: "#f56a00",
                backgroundColor: "#fde3cf",
                fontSize: 16,
              }}
              size={24}
            >
              <Tooltip title="Ant User" placement="bottom">
                <Avatar size={24} style={{ fontSize: 16 }}>
                  NH
                </Avatar>
              </Tooltip>
              <Tooltip title="Ant User" placement="bottom">
                <Avatar size={24} style={{ fontSize: 16 }}>
                  NH
                </Avatar>
              </Tooltip>
              <Tooltip title="Ant User" placement="bottom">
                <Avatar size={24} style={{ fontSize: 16 }}>
                  NH
                </Avatar>
              </Tooltip>
              <Tooltip title="Ant User" placement="bottom">
                <Avatar size={24} style={{ fontSize: 16 }}>
                  NH
                </Avatar>
              </Tooltip>
            </Avatar.Group>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CardItem;
