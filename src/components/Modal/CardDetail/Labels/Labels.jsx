/* eslint-disable react/prop-types */
import { CheckOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Flex, Form, Input, Row, Tag } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createBoardLabel,
  deleteBoardLabel,
  updateBoardLabel,
} from "../../../../stores/board/boardThunk";
import {
  addLabelToCardUI,
  deleteCardLabel,
  updateCardLabel,
} from "../../../../stores/card/cardSlice";
import {
  addALabelToCard,
  removeLabelFromCard,
} from "../../../../stores/card/cardThunk";
import {
  addACardLabelInList,
  removeACardLabelInList,
  removeLabelFromCardsInAllLists,
  updateLabelInAllCardList,
} from "../../../../stores/list/ListSlice";
import "./Labels.scss";
import { addBoardLabelUI } from "../../../../stores/board/boardSlice";
const Labels = ({ card }) => {
  const { selectedBoard } = useSelector((state) => state.board);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [colorSelected, setColorSelected] = useState("magenta");
  const [idSelected, setIdSelected] = useState("");
  const [text, setText] = useState("");
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const handleSelectLabel = (checkedValues, label) => {
    const dataToAdd = {
      cardId: card?._id,
      labelData: checkedValues,
    };
    if (!isChecked(label)) {
      dispatch(
        addACardLabelInList({ listId: card?.owner, cardId: card?._id, label })
      );
      dispatch(addLabelToCardUI(label));
      dispatch(addALabelToCard(dataToAdd));
    } else {
      dispatch(
        removeACardLabelInList({
          listId: card?.owner,
          cardId: card?._id,
          label,
        })
      );
      dispatch(deleteCardLabel({ label: { _id: label._id } }));
      dispatch(removeLabelFromCard(dataToAdd));
    }
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
    const data = {
      boardId,
      listId: card?.owner,
      cardId: card?._id,
      labelId: idSelected,
      label: {
        selected: true,
        text: text,
        type: colorSelected,
        board: boardId,
      },
    };
    if (isAdd && isEdit) {
      console.log("update");
      dispatch(updateLabelInAllCardList({ ...data.label, _id: idSelected }));
      dispatch(updateCardLabel({ ...data.label, _id: idSelected }));
      dispatch(updateBoardLabel(data));
    } else {
      dispatch(addBoardLabelUI(data.label));
      dispatch(createBoardLabel(data));
    }
    handleBack();
  };
  const handleDeleteLabel = () => {
    const data = {
      boardId,
      labelId: idSelected,
    };
    dispatch(removeLabelFromCardsInAllLists(data));
    dispatch(deleteCardLabel({ label: { _id: idSelected } }));
    handleBack();
    dispatch(deleteBoardLabel(data));
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
  const isChecked = (l) => {
    return card?.labels?.some((label) => label._id === l._id);
  };
  const renderCardLabels =
    selectedBoard &&
    selectedBoard?.labels.map((l, index) => (
      <Flex key={index} justify="space-between">
        <Checkbox
          value={l?._id}
          className="check-box__item"
          onClick={(e) => handleSelectLabel(e.target.value, l)}
          checked={isChecked(l)}
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
        Tạo mới
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
        <Form.Item name="title" label="Tiêu đề">
          <Input
            value={text}
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
          ></Input>
        </Form.Item>
        <Form.Item name="type" label="Màu">
          <Row gutter={8}>
            {labelTypes &&
              labelTypes.map((t, index) => (
                <Col span={8} key={index + t + ""}>
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
        <Flex
          gap={8}
          justify="space-between"
          style={{ float: isEdit ? "none" : "right" }}
        >
          {isEdit && (
            <Button type="" color="" danger onClick={() => handleDeleteLabel()}>
              Xóa
            </Button>
          )}
          <Flex gap={8} justify="space-between">
            <Button
              onClick={() => {
                setIsAdd(false);
                setIsEdit(false);
                setText("");
                setColorSelected("magenta");
              }}
            >
              Hủy
            </Button>
            <Button type="primary" onClick={handleClick}>
              OK
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Labels;
