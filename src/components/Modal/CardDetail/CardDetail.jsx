/* eslint-disable react/prop-types */
import {
  CommentOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Dropdown,
  Flex,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  message as msg,
} from "antd";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  setSelectedCard,
  updateCardDateCompletedUI,
} from "../../../stores/card/cardSlice";
import { updateCardInfo, updateDates } from "../../../stores/card/cardThunk";
import { updateDateCardListUI } from "../../../stores/list/ListSlice";
import QuillTextBox from "../../QuillTextBox/QuillTextBox";
import ActivityAndComment from "./Activity/ActivityAndComment";
import "./CardDetail.scss";
import Labels from "./Labels/Labels";
import Attachment from "./UploadAttachment/Attachment";
const { RangePicker } = DatePicker;
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
const CardDetail = () => {
  const { cardName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootLink = location.pathname?.split("/").slice(0, 4).join("/");
  const { selectedCard } = useSelector((state) => state.card);
  const { boardId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [tooltipDate, setTooltipDate] = useState("");
  // console.log(timeNow);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleModalOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleClose = () => {
    dispatch(setSelectedCard(null));
    navigate(rootLink);
  };
  const handleOk = () => {
    handleClose();
  };
  useEffect(() => {
    if (!selectedCard) {
      navigate(-1);
    }
  }, [navigate, selectedCard]);
  useEffect(() => {
    const dueDate = dayjs(selectedCard?.date?.dueDate);
    const now = dayjs();

    if (!selectedCard?.date?.dueDate || selectedCard?.date?.completed) {
      setStatus("");
      setTooltipDate("");
    } else if (dueDate.isBefore(now)) {
      setStatus("error");
      setTooltipDate("Over due");
    } else if (dueDate.isSame(now, "day")) {
      setStatus("warning");
      setTooltipDate("Due date is today");
    } else {
      setStatus("");
      setTooltipDate("");
    }

    return () => {};
  }, [selectedCard]);
  //==============================================================  //==============================================================

  const renderDueDateStatus = (date) => {
    const now = dayjs();
    if (selectedCard?.date?.completed) {
      setStatus("");
      setTooltipDate("");
      return;
    }
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
  const renderLabels =
    selectedCard?.labels &&
    selectedCard?.labels.map((l) => {
      return (
        <Tag style={{ height: 22, minWidth: 30 }} key={l?._id} color={l?.type}>
          {l?.text}
        </Tag>
      );
    });
  const renderDate = () => {
    if (selectedCard.date.startDate && selectedCard.date.dueDate) {
      return [
        dayjs.utc(selectedCard?.date.startDate),
        dayjs.utc(selectedCard?.date.dueDate),
      ];
    } else return [];
  };
  //==============================================================  //==============================================================
  const handleDateChange = (e, date) => {
    if (!date[0] || !date[1]) {
      return;
    }
    const dueDate = dayjs(date[1]);
    renderDueDateStatus(dueDate);
    const dataAddDate = {
      boardId: boardId,
      listId: selectedCard?.owner,
      cardId: selectedCard?._id,
      date: {
        startDate: dayjs.utc(date[0]),
        dueDate: dayjs.utc(date[1]),
        dueTime: date[1]?.split(" ")[1],
        completed: selectedCard?.date?.completed,
      },
    };
    dispatch(updateDateCardListUI(dataAddDate));
    dispatch(updateDates(dataAddDate))
      .unwrap()
      .then((rs) => msg.success(rs.message))
      .catch((er) => msg.error(er.message));
  };
  const handleCardTitleChange = (data) => {
    if (data.value !== data.previousValue) {
      const updateData = {
        boardId: boardId,
        listId: selectedCard.owner,
        cardId: selectedCard._id,
        updateObj: { title: data?.value },
      };
      dispatch(updateCardInfo(updateData));
    }
  };
  const handleCardCompleteChange = (data) => {
    if (selectedCard?.date?.completed !== data) {
      const dataAddDate = {
        boardId: boardId,
        listId: selectedCard?.owner,
        cardId: selectedCard?._id,
        date: {
          ...selectedCard?.date,
          completed: data,
        },
      };
      dispatch(
        updateDateCardListUI({ ...dataAddDate, date: { completed: data } })
      );
      dispatch(updateCardDateCompletedUI(data));
      dispatch(updateDates(dataAddDate))
        .unwrap()
        .then((rs) => msg.success(rs.message))
        .catch((er) => msg.error(er.message));
      const dueDate = dayjs(selectedCard?.date?.dueDate);
      renderDueDateStatus(dueDate);
    }
  };
  //==============================================================  //==============================================================

  const itemDetails = [
    {
      key: "1",
      label: "Labels",
      children: (
        <Flex align="center" wrap="wrap" gap={4}>
          {renderLabels}
          <Button
            style={{
              height: 22,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={showModal}
            type="text"
            icon={<PlusOutlined />}
          >
            Add
          </Button>
        </Flex>
      ),
      span: 4,
    },
    {
      key: "2",
      label: "Telephone",
      children: "1810000000",
      span: 4,
    },
  ];

  const itemTime = [
    {
      key: "1",
      label: "Date start",
      children: (
        <Tooltip placement="top" title={tooltipDate} arrow={false}>
          <RangePicker
            showTime
            onChange={handleDateChange}
            defaultValue={renderDate()}
            status={status}
          />
        </Tooltip>
      ),
      span: 4,
    },
    {
      key: "2",
      label: "Status",
      children: (
        <Select
          placeholder="Status"
          variant="borderless"
          defaultValue={selectedCard?.date?.completed}
          onChange={handleCardCompleteChange}
          style={{
            flex: 1,
          }}
          options={[
            {
              value: false,
              label: "Unresolved",
            },
            {
              value: true,
              label: "Complete",
            },
          ]}
        />
      ),
      span: 4,
    },
    {
      key: "3",
      label: "Created at",
      children: (
        <DatePicker disabled defaultValue={dayjs(selectedCard?.createdAt)} />
      ),
      span: 4,
    },
  ];
  const subCol = [
    {
      key: "1",
      label: "Activity",
      children: <ActivityAndComment />,
    },
  ];
  const col1 = [
    {
      key: "1",
      label: "Details",
      children: <Descriptions title="" items={itemDetails} layout="" />,
    },
    {
      key: "2",
      label: "Description",
      children: <QuillTextBox />,
    },
    {
      key: "3",
      label: "Attachments",
      children: <Attachment />,
    },
  ];
  const col2 = [
    {
      key: "1",
      label: "Peoples",
    },
    {
      key: "2",
      label: "Dates",
      children: <Descriptions title="" items={itemTime} layout="" />,
    },
  ];
  const items = [
    {
      label: "Watch issue",
      key: "1",
      icon: <EyeOutlined />,
    },
    {
      label: "Labels",
      key: "12",
      icon: <TagsOutlined />,
    },
    {
      label: "Delete",
      key: "3",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];
  const menuProps = {
    items,
  };

  return (
    <Modal
      title={
        <EditText
          name="title"
          defaultValue={selectedCard?.title}
          inline
          style={{ width: "calc(100% - 340px)" }}
          onSave={(value) => handleCardTitleChange(value)}
        />
      }
      style={{
        top: 20,
      }}
      open={cardName && selectedCard ? true : false}
      onOk={handleOk}
      onCancel={handleClose}
      centered
      footer={false}
      className="card-detail"
    >
      <div className="card-detail_container">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={14}>
            <Flex gap={8}>
              <Button icon={<EditOutlined />}>Edit</Button>
              <Button icon={<CommentOutlined />}>Add comment</Button>
              <Dropdown menu={menuProps}>
                <Button>
                  <Space>
                    More
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Flex>
            <Collapse defaultActiveKey={["1", "2", "3"]} ghost items={col1} />
          </Col>

          <Col xs={24} sm={24} md={24} lg={10}>
            <Collapse
              defaultActiveKey={["1", "2", "3", "4"]}
              ghost
              items={col2}
            />
          </Col>
        </Row>
        <Collapse defaultActiveKey={["1"]} ghost items={subCol} />
        <Modal
          title="Label"
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleCancel}
          centered
          width={300}
          footer={false}
        >
          <Labels card={selectedCard} />
        </Modal>
      </div>
    </Modal>
  );
};

export default CardDetail;
