/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ClockCircleOutlined
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Flex, Input, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setSelectedCard } from "../../../stores/card/cardSlice";
import "./CardItem.scss";
const CardItem = ({
  card = {},
  isAdd = false,
  newTaskTitle,
  setNewTaskTitle,
}) => {
  const [isEnter, setIsEnter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const rootLink = location.pathname?.split("/").slice(0, 4).join("/");
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [tooltipDate, setTooltipDate] = useState("");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card?._id, data: { ...card, typeDrag: "card" } });

  const dndKitListStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : undefined,
    border: isDragging ? "1px solid #2ecc71" : undefined,
  };

  const handleSelectCard = () => {
    const slug = _.kebabCase(card.title.toLowerCase());
    dispatch(setSelectedCard(card));
    navigate(`${rootLink}/c/${slug}`);
  };
  const renderDueDateStatus = (date) => {
    const now = dayjs();
    if (date.isBefore(now)) {
      setStatus("error");
      setTooltipDate("Over due");
    } else if (date.isSame(now, "day")) {
      setStatus("warning");
      setTooltipDate("Due date is today");
    } else {
      setStatus("");
      setTooltipDate("");
    }
  };
  useEffect(() => {
    const dueDate = dayjs(card?.date?.dueDate);
    if (!card?.date?.dueDate || card?.date?.completed) {
      setStatus("");
      setTooltipDate("");
    } else renderDueDateStatus(dueDate);
  }, [card?.date?.completed, card?.date?.dueDate]);
  const renderStatusColor = () => {
    if (status == "" && card?.date?.completed) {
      return "checkbox-due--complete";
    }
    if (status == "" && !card?.date?.completed) {
      return "checkbox-due";
    }
    if (status == "error") {
      return "checkbox-due--overdue";
    }
    if (status == "warning") {
      return "checkbox-due";
    }
  };
  const renderLabels =
    card?.labels?.length > 0 &&
    card?.labels?.map((l) => (
      <Tag
        key={l?._id + Math.random(1000)}
        color={l?.type}
        style={{ minHeight: l?.text?.length < 1 ? 12 : "none", minWidth: 24 }}
      >
        {l?.text}
      </Tag>
    ));

  return !isAdd ? (
    <Flex
      className="card-item"
      vertical
      ref={setNodeRef}
      style={dndKitListStyle}
      {...attributes}
      {...listeners}
      onClick={handleSelectCard}
    >
      <div className="card-item__cover"></div>
      <Flex vertical gap={4}>
        <Flex className="card-item__labels" wrap="wrap" gap={4}>
          {renderLabels}
        </Flex>
        <div className="card-item__title">{card?.title}</div>
        <Flex className="card-item__content" wrap="wrap" align="center" gap={8}>
          <Flex gap={8} align="center" wrap="wrap" style={{ height: 28 }}>
            {/* <Flex align="center" className="card-item__content-item">
              <EyeOutlined />
            </Flex> */}
            {card?.date?.dueDate && (
              <Tooltip placement="bottom" title={tooltipDate} arrow={false}>
                <Flex
                  align="center"
                  className={renderStatusColor()}
                  gap={3}
                  onMouseEnter={() => setIsEnter(true)}
                  onMouseLeave={() => setIsEnter(false)}
                >
                  <ClockCircleOutlined size={12} />
                  <span>
                    {card?.date?.dueDate &&
                      dayjs(card?.date?.dueDate).format("YYYY-MM-DD")}
                  </span>
                </Flex>
              </Tooltip>
            )}
            {/* <Flex align="center" gap={3} className="card-item__content-item">
              <PaperClipOutlined />
              <span>2</span>
            </Flex> */}
            {/* <Flex align="center" gap={3} className="card-item__content-item">
              <MessageOutlined />
              <span>2</span>
            </Flex> */}
            {/* <Flex gap={3} align="center" className="card-item__content-item">
              <CheckSquareOutlined />
              <span>2/4</span>
            </Flex> */}
          </Flex>
          <Flex align="center" justify="end" flex={1}>
            {card?.members[0] && (
              <Tooltip title="Board User" placement="bottom">
                <Avatar
                  size={24}
                  style={{ fontSize: 13, background: card?.members[0].color }}
                >
                  {card?.members[0].name[0] + card?.members[0].surname[0]}
                </Avatar>
              </Tooltip>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex className="card-item" vertical>
      <Input
        className="card-item__input"
        placeholder="Type new title"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
    </Flex>
  );
};

export default CardItem;
