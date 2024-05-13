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
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCard } from "../../../stores/card/cardSlice";
import { updateCardInfo } from "../../../stores/card/cardThunk";
import QuillTextBox from "../../QuillTextBox/QuillTextBox";
import ActivityAndComment from "./Activity/ActivityAndComment";
import "./CardDetail.scss";
import Labels from "./Labels/Labels";
import Attachment from "./UploadAttachment/Attachment";
const CardDetail = () => {
  const { cardName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootLink = location.pathname?.split("/").slice(0, 4).join("/");
  const { selectedCard } = useSelector((state) => state.card);

  const { boardId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleModalOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (!selectedCard) {
      navigate(-1);
    }
  }, [navigate, selectedCard]);

  const handleClose = () => {
    dispatch(setSelectedCard(null));
    navigate(rootLink);
  };
  const handleOk = () => {
    handleClose();
  };
  const renderLabels =
    selectedCard?.labels &&
    selectedCard?.labels.map((l) => {
      if (l.selected === true) {
        return (
          <Tag
            style={{ height: 22, minWidth: 30 }}
            key={l?._id}
            color={l?.type}
          >
            {l?.text}
          </Tag>
        );
      }
    });
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
      children: <DatePicker />,
      span: 4,
    },
    {
      key: "2",
      label: "Due date",
      children: <DatePicker />,
      span: 4,
    },
    {
      key: "3",
      label: "Created",
      children: (
        <DatePicker disabled defaultValue={dayjs(selectedCard?.createdAt)} />
      ),
      span: 4,
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
    {
      key: "4",
      label: "Activity",
      children: <ActivityAndComment />,
    },
  ];
  const col2 = [
    {
      key: "1",
      label: "Peoples",
      // children: <p>{text}</p>,
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
          <Col span={16}>
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
            <Collapse
              defaultActiveKey={["1", "2", "3", "4"]}
              ghost
              items={col1}
            />
          </Col>

          <Col span={8}>
            <Collapse
              defaultActiveKey={["1", "2", "3", "4"]}
              ghost
              items={col2}
            />
          </Col>
        </Row>
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
