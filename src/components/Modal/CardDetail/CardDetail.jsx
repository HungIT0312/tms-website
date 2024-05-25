/* eslint-disable react/prop-types */
import {
  ApartmentOutlined,
  CommentOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Dropdown,
  Flex,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Tooltip,
  message as msg,
} from "antd";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import _ from "lodash";
import { useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  setSelectedCard,
  updateCardDateCompletedUI,
  updateCardSubTaskUI,
} from "../../../stores/card/cardSlice";
import {
  addCard,
  changeMemberAssign,
  deleteCardById,
  getCardById,
  updateCardInfo,
  updateDates,
} from "../../../stores/card/cardThunk";
import {
  deleteCardInListById,
  updateCardInListById,
  updateCardMemberUI,
  updateDateCardListUI,
  updateParentCardUI,
} from "../../../stores/list/ListSlice";
import QuillTextBox from "../../QuillTextBox/QuillTextBox";
import ActivityAndComment from "./Activity/ActivityAndComment";
import "./CardDetail.scss";
import Labels from "./Labels/Labels";
import SubTask from "./SubTask/SubTask";
import Attachment from "./UploadAttachment/Attachment";
const { RangePicker } = DatePicker;
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
const { Option } = Select;
const CardDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootLink = location.pathname?.split("/").slice(0, 4).join("/");
  const { selectedCard, isLoading } = useSelector((state) => state.card);
  const { selectedBoard } = useSelector((state) => state.board);
  const { boardId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [newCard, setNewCard] = useState("");
  const [tooltipDate, setTooltipDate] = useState("");
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
    } else if (now.isAfter(dueDate, "day")) {
      setStatus("error");
      setTooltipDate("Quá hạn");
    } else if (dueDate.isSame(now, "day")) {
      setStatus("warning");
      setTooltipDate("Tới hạn hôm nay");
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
      setTooltipDate("Quá hạn");
    } else if (date.isSame(now, "day")) {
      setStatus("warning");
      setTooltipDate("Tới hạn hôm nay");
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
    if (selectedCard?.date?.startDate && selectedCard?.date?.dueDate) {
      return [
        dayjs.utc(selectedCard?.date?.startDate),
        dayjs.utc(selectedCard?.date?.dueDate),
      ];
    } else return [];
  };
  const handleSelectCard = (card) => {
    const slug = _.kebabCase(card?.title?.toLowerCase());
    dispatch(setSelectedCard(card));
    navigate(`${rootLink}/c/${slug}`);
    dispatch(getCardById(card?._id));
  };
  const renderSubTasks = selectedCard?.subTasks?.map((s, idx) => (
    <SubTask key={idx} handleClick={handleSelectCard} task={s}></SubTask>
  ));
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
  const handleCardTitleChange = (data) => {
    if (data.value !== data.previousValue) {
      const updateData = {
        boardId: boardId,
        listId: selectedCard?.owner,
        cardId: selectedCard?._id,
        updateObj: { ...selectedCard, title: data?.value },
      };

      dispatch(updateCardInListById(updateData));
      dispatch(updateCardInfo(updateData));
    }
  };
  const triggerCallUpdate = (value) => {
    const newDes = {
      boardId: boardId,
      listId: selectedCard?.owner,
      cardId: selectedCard?._id,
      updateObj: {
        ...selectedCard,
        description: value,
      },
    };

    dispatch(updateCardInListById(newDes));
    dispatch(updateCardInfo(newDes));
  };
  const handleDeleteThisTask = () => {
    const dataDelete = {
      boardId: boardId,
      listId: selectedCard?.owner,
      cardId: selectedCard?._id,
      parentCardId: selectedCard?.isSubTaskOf?._id,
    };
    dispatch(setSelectedCard(null));
    dispatch(deleteCardInListById(dataDelete));
    msg.success("Xóa thành công!");
    navigate(rootLink);
    dispatch(deleteCardById(dataDelete));
  };
  const handleAddNewCard = () => {
    if (!newCard) return;
    const data = {
      title: newCard,
      listId: selectedCard?.owner,
      boardId: boardId,
      parentCardId: selectedCard?._id,
    };
    dispatch(addCard(data))
      .unwrap()
      .then((rs) => {
        msg.success("Thành công!");
        dispatch(updateParentCardUI({ ...data, newCard: rs.card }));
        dispatch(updateCardSubTaskUI(rs.card));
      });
    setNewCard("");
  };
  const handleAddPeople = (e) => {
    const crrMember = selectedBoard?.members.filter((mem) => mem.user == e);
    const dataAddDate = {
      boardId: boardId,
      listId: selectedCard?.owner,
      cardId: selectedCard?._id,
      member: crrMember,
    };
    dispatch(updateCardMemberUI(dataAddDate));
    dispatch(changeMemberAssign({ ...dataAddDate, memberId: e }));
  };
  //==============================================================  //==============================================================
  const items = [
    {
      label: "Nhãn",
      key: "label",
      icon: <TagsOutlined />,
    },
    {
      label: "Xóa",
      key: "delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const itemDetails = [
    {
      key: "1",
      label: "Nhãn",
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
            Thêm
          </Button>
        </Flex>
      ),
      span: 4,
    },
    {
      key: "2",
      label: "Task phụ của",
      children:
        selectedCard?.isSubTaskOf && !selectedCard?.isSubTaskOf?._destroy ? (
          <Flex
            onClick={() => handleSelectCard(selectedCard?.isSubTaskOf)}
            style={{ cursor: "pointer" }}
          >
            <Tag icon={<ApartmentOutlined />} bordered={false}>
              {selectedCard?.isSubTaskOf?.title}
            </Tag>
          </Flex>
        ) : (
          "Không có"
        ),
      span: 4,
    },
  ];

  const itemTime = [
    {
      key: "1",
      label: "Ngày làm",
      children: (
        <Tooltip placement="top" title={tooltipDate} arrow={false}>
          <RangePicker
            showTime={false}
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
      label: "Trạng thái",
      children: (
        <Select
          placeholder="Trạng thái"
          variant="borderless"
          defaultValue={selectedCard?.date?.completed}
          onChange={handleCardCompleteChange}
          style={{
            flex: 1,
          }}
          options={[
            {
              value: false,
              label: "Chưa giải quyết",
            },
            {
              value: true,
              label: "Đã hoàn thành",
            },
          ]}
        />
      ),
      span: 4,
    },
    {
      key: "3",
      label: "Ngày tạo",
      children: (
        <DatePicker disabled defaultValue={dayjs(selectedCard?.createdAt)} />
      ),
      span: 4,
    },
  ];

  const subCol = [
    {
      key: "1",
      label: "Hoạt động",
      children: <ActivityAndComment />,
    },
  ];

  const ItemPeople = [
    {
      key: "1",
      label: "Chỉ định cho",
      children: (
        <Select
          showSearch
          placeholder="Chỉ định"
          variant="borderless"
          defaultValue={
            selectedCard?.members[0]?.user?._id ||
            selectedCard?.members[0]?.user
          }
          style={{
            flex: 1,
          }}
          onChange={handleAddPeople}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {selectedBoard?.members?.map((mem) => (
            <Option
              key={mem.user}
              value={mem.user}
              label={mem.name + " " + mem.surname}
            >
              <Flex className="" gap={8}>
                <Avatar
                  size={24}
                  style={{ background: mem?.color, fontSize: 12 }}
                >
                  {mem?.name[0] + mem?.surname[0]}
                </Avatar>
                <div>{mem.name + " " + mem.surname}</div>
              </Flex>
            </Option>
          ))}
        </Select>
      ),
      span: 4,
    },
  ];

  const col1 = [
    {
      key: "1",
      label: "Chi tiết",
      children: <Descriptions title="" items={itemDetails} layout="" />,
    },
    {
      key: "2",
      label: "Mô tả",
      children: (
        <QuillTextBox
          getCleanHTML={triggerCallUpdate}
          content={selectedCard?.description}
        />
      ),
    },
    {
      key: "3",
      label: "Đính kèm",
      children: <Attachment />,
    },
  ];

  const col2 = [
    {
      key: "1",
      label: "Người dùng",
      children: <Descriptions title="" items={ItemPeople} layout="" />,
    },
    {
      key: "2",
      label: "Ngày",
      children: <Descriptions title="" items={itemTime} layout="" />,
    },
    {
      key: "3",
      label: "Task phụ",
      children:
        selectedCard?.isSubTaskOf && !selectedCard?.isSubTaskOf?._destroy ? (
          <Flex>Đây là một task phụ.</Flex>
        ) : (
          <Flex vertical gap={8}>
            <Flex gap={8} vertical>
              {renderSubTasks}
            </Flex>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                value={newCard}
                placeholder="Nhập tên thẻ mới."
                onChange={(e) => setNewCard(e.target.value)}
              />
              <Button prefix={<PlusOutlined />} onClick={handleAddNewCard}>
                Thêm
              </Button>
            </Space.Compact>
          </Flex>
        ),
    },
  ];

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "label":
        showModal();
        break;
      case "delete":
        Modal.confirm({
          title: "Bạn có muốn xóa task này không?",
          onOk: () => {
            handleDeleteThisTask();
          },
          okText: "Xóa",
          okType: "danger",
          centered: true,
          cancelText: "Hủy",
        });
        break;
      default:
        break;
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
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
      open={true}
      onOk={handleOk}
      onCancel={handleClose}
      centered
      footer={false}
      className="card-detail"
    >
      {!isLoading && (
        <div className="card-detail_container">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={14}>
              <Flex gap={8}>
                <Button icon={<CommentOutlined />}>Thêm bình luận</Button>
                <Dropdown menu={menuProps}>
                  <Button>
                    <Space>
                      Thêm
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
            title="Nhãn"
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
      )}
      {isLoading && (
        <Flex justify="center" align="center" style={{ height: 500 }}>
          <Spin />
        </Flex>
      )}
    </Modal>
  );
};

export default CardDetail;
