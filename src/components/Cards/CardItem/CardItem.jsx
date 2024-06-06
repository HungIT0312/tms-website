/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ApartmentOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExportOutlined,
  LeftOutlined,
  MessageOutlined,
  PaperClipOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Flex, Input, Popover, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setSelectedCard } from "../../../stores/card/cardSlice";
import "./CardItem.scss";
import { changeCardToAnotherList } from "../../../stores/list/ListSlice";
import { changeCardToDiffList } from "../../../stores/list/ListThunk";
import { getCardById } from "../../../stores/card/cardThunk";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
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
  const { lists } = useSelector((state) => state.list);
  const { boardId } = useParams();
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
    // overflow: card?.isPlaceHolder ? "hidden" : "unset",
    // height: card?.isPlaceHolder ? "0px" : "unset",
    // display: card?.isPlaceHolder ? "none" : "block",
    // overflow: "unset",
  };
  const handleSelectCard = () => {
    const slug = _.kebabCase(card.title.toLowerCase());
    dispatch(setSelectedCard(card));
    navigate(`${rootLink}/c/${slug}`);
    dispatch(getCardById(card?._id));
  };
  const renderDueDateStatus = (date) => {
    const now = dayjs();
    if (now.isAfter(date, "day")) {
      setStatus("error");
      setTooltipDate("Quá hạn");
    } else if (date.isSame(now, "day")) {
      setStatus("warning");
      setTooltipDate("Đến hạn hôm nay");
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
        style={{
          minHeight: l?.text?.length < 1 ? 12 : "none",
          minWidth: 24,
          zIndex: 0,
        }}
      >
        {l?.text}
      </Tag>
    ));
  const handleEditClick = (e, list) => {
    e.stopPropagation();
    const data = {
      card: card,
      newListId: list?._id,
    };
    dispatch(
      changeCardToDiffList({
        boardId: boardId,
        listId: card?.owner,
        newListId: list?._id,
        cardId: card?._id,
      })
    );

    dispatch(changeCardToAnotherList(data));
  };
  const renderListTitle = lists
    ?.filter((l) => l._id !== card?.owner)
    .map((l) => (
      <Flex
        className="change-item"
        key={l._id}
        onClick={(e) => handleEditClick(e, l)}
      >
        {l?.title}
      </Flex>
    ));
  const renderContent = (
    <Flex vertical gap={8}>
      <Flex className="change-title">Chuyển đến</Flex>
      {renderListTitle}
    </Flex>
  );
  const comments = card?.activities?.filter((a) => a?.isComment);
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
      <Popover
        title="Thay đổi vị trí"
        placement="bottomLeft"
        content={renderContent}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex className="edit-Btn" onClick={(e) => e.stopPropagation()}>
          <EllipsisOutlined />
        </Flex>
      </Popover>

      <div className="card-item__cover"></div>
      <Flex vertical gap={4}>
        <Flex className="card-item__labels" wrap="wrap" gap={4}>
          {renderLabels}
        </Flex>
        <div className="card-item__title">{card?.title}</div>

        <Flex className="card-item__content" wrap="wrap" align="center" gap={8}>
          <Flex gap={8} align="center" wrap="wrap" style={{ height: 28 }}>
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
            {card?.attachments?.length > 0 && (
              <Flex align="center" gap={3} className="card-item__content-item">
                <PaperClipOutlined />
                <span>{card?.attachments?.length}</span>
              </Flex>
            )}

            {card?.subTasks?.length > 0 && (
              <Flex gap={3} align="center" className="card-item__content-item">
                <ApartmentOutlined />
                <span>{card?.subTasks?.length}</span>
              </Flex>
            )}
            {comments?.length > 0 && (
              <Flex gap={3} align="center" className="card-item__content-item">
                <CommentOutlined />
                <span>{comments?.length}</span>
              </Flex>
            )}
          </Flex>
          <Flex align="end" justify="end" flex={1}>
            {card?.members?.length > 0 ? (
              // <Tooltip title="Thành viên" placement="bottom">
              <Avatar
                size={24}
                style={{
                  fontSize: 13,
                  background: card?.members[0]?.color,
                }}
              >
                {card?.members[0]?.surname[0] + card?.members[0]?.name[0]}
              </Avatar>
            ) : (
              // {/* </Tooltip> */}
              <></>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex className="card-item" vertical>
      <Input
        className="card-item__input"
        placeholder="Tiêu đề mới"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
    </Flex>
  );
};

export default CardItem;
