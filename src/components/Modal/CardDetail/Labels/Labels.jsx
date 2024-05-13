/* eslint-disable react/prop-types */
import { CheckOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Flex, Form, Input, Row, Tag } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setCardLabelSelected } from "../../../../stores/card/cardSlice";
import "./Labels.scss";
import {
  createCardLabel,
  updateCardLabel,
} from "../../../../stores/card/cardThunk";
import {
  addCardLabel,
  setCardInfoInList,
} from "../../../../stores/list/ListSlice";
const Labels = ({ card }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [colorSelected, setColorSelected] = useState("magenta");
  const [idSelected, setIdSelected] = useState("");
  const [text, setText] = useState("");
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const handleSelectLabel = (checkedValues, label) => {
    const data = {
      boardId,
      listId: card?.owner,
      cardId: card?._id,
      labelId: checkedValues,
      label: {
        ...label,
        selected: !label?.selected,
      },
    };
    dispatch(setCardLabelSelected(data));
    dispatch(setCardInfoInList(data));
    dispatch(updateCardLabel(data));
  };
  const handleEditChange = (id, type, txt) => {
    setIsAdd(true);
    setIsEdit(true);
    setColorSelected(type);
    setIdSelected(id);
    setText(txt);
  };
  const handleBack = () => {
    setIsAdd(false);
    setIsEdit(false);
    setText("");
    setIdSelected("");
    setColorSelected("magenta");
  };
  const handleClick = () => {
    if (isAdd && isEdit) {
      const data = {
        boardId,
        listId: card?.owner,
        cardId: card?._id,
        labelId: idSelected,
        label: {
          selected: true,
          text: text,
          type: colorSelected,
        },
      };
      dispatch(setCardLabelSelected(data));
      dispatch(setCardInfoInList(data));
      dispatch(updateCardLabel(data));
    } else {
      const data = {
        boardId,
        listId: card?.owner,
        cardId: card?._id,
        label: {
          selected: true,
          text: text,
          type: colorSelected,
        },
      };
      dispatch(createCardLabel(data));
      dispatch(addCardLabel(data));
      console.log(data);
    }
    handleBack();
  };
  const labelTypes = [
    "success",
    "warning",
    "progress",
    "error",
    "orange",
    "purple",
    "magenta",
    "volcano",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
  ];
  const renderCardLabels =
    card &&
    card?.labels.map((l, index) => (
      <Flex key={index} justify="space-between">
        <Checkbox
          value={l?._id}
          className="check-box__item"
          onClick={(e) => handleSelectLabel(e.target.value, l)}
          checked={l?.selected}
        >
          <Tag className="check-box__item-tag" color={l?.type}>
            {l?.text}
          </Tag>
        </Checkbox>
        <EditOutlined
          className="check-box__icon"
          onClick={() => handleEditChange(l?._id, l?.type, l?.text)}
        />
      </Flex>
    ));
  return !isAdd ? (
    <Flex vertical>
      <Flex className="check-box__container">{renderCardLabels}</Flex>
      <Button
        type="text"
        icon={<PlusOutlined />}
        onClick={() => setIsAdd(!isAdd)}
      >
        Create new
      </Button>
    </Flex>
  ) : (
    <Flex vertical>
      <Tag
        style={{
          height: 30,
          width: "calc(100% - 32px)",
          margin: 16,
          display: "flex",
          alignItems: "center",
        }}
        color={colorSelected}
      >
        {text}
      </Tag>
      <Form layout="vertical">
        <Form.Item name="title" label="Title">
          <Input onChange={(e) => setText(e.target.value)}></Input>
        </Form.Item>
        <Form.Item name="type" label="Color/type">
          <Row gutter={8}>
            {labelTypes &&
              labelTypes.map((t, index) => (
                <Col span={8} key={index}>
                  <Tag
                    style={{
                      height: 30,
                      width: "100%",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    color={t}
                    onClick={() => setColorSelected(t)}
                  >
                    {colorSelected === t && (
                      <div className="bg-image--checked">
                        <CheckOutlined color="#fff" />
                      </div>
                    )}
                  </Tag>
                </Col>
              ))}
          </Row>
        </Form.Item>
        <Flex gap={8} style={{ float: "right" }}>
          <Button
            onClick={() => {
              setIsAdd(false);
              setIsEdit(false);
              setText("");
              setColorSelected("magenta");
            }}
          >
            Back
          </Button>
          <Button type="primary" onClick={handleClick}>
            OK
          </Button>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Labels;
