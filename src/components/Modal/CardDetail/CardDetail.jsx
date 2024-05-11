/* eslint-disable react/prop-types */
import {
  CommentOutlined,
  DownOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Descriptions,
  Dropdown,
  Flex,
  Modal,
  Row,
  Space,
} from "antd";
import { useEffect } from "react";
import { EditText } from "react-edit-text";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCard } from "../../../stores/card/cardSlice";
import QuillTextBox from "../../QuillTextBox/QuillTextBox";
import ActivityAndComment from "./Activity/ActivityAndComment";
import "./CardDetail.scss";
import Attachment from "./UploadAttachment/Attachment";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const CardDetail = () => {
  const { cardName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootLink = location.pathname?.split("/").slice(0, 4).join("/");
  const { selectedCard } = useSelector((state) => state.card);
  useEffect(() => {
    if (!selectedCard) {
      navigate(-1);
    }
    console.log(selectedCard?.createdAt);
    const dateCreate = new Date(selectedCard?.createdAt);
    console.log(dateCreate);
  }, [navigate, selectedCard]);

  const handleClose = () => {
    dispatch(setSelectedCard(null));
    navigate(rootLink);
  };
  const handleOk = () => {
    handleClose();
  };
  const itemDetails = [
    {
      key: "1",
      label: "UserName",
      children: "Zhou Maomao",
      span: 2,
    },
    {
      key: "2",
      label: "Telephone",
      children: "1810000000",
      span: 2,
    },
    {
      key: "3",
      label: "Live",
      children: "Hangzhou, Zhejiang",
      span: 2,
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
      label: "1st menu item",
      key: "1",
      icon: <UserOutlined />,
    },
  ];
  const menuProps = {
    items,
  };
  const handleCardTitleChange = (data) => {
    // const updateData = {
    //   cardId: selectedCard?._id,
    //   newValue: data.value,
    //   property: cardProperty.TITLE,
    // };
    // dispatch(updateBoardInfo(updateData));
    // console.log(data);
  };
  const handleChange = (e, setFn) => {
    setFn(e.target.value);
    console.log(e.target.value);
  };
  return (
    <Modal
      title={
        <EditText
          name="title"
          defaultValue={selectedCard?.title}
          inline
          // style={{ width: `${selectedCard?.title?.length}ch` }}
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
                    Button
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
      </div>
    </Modal>
  );
};

export default CardDetail;
