import { Avatar, Checkbox, Flex, Input, Tag } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getListsByFilter } from "../../../stores/list/ListThunk";
import "./BoardFilter.scss";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const BoardFilter = () => {
  const { selectedBoard } = useSelector((state) => state.board);
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const [userSearch, setUserSearch] = useState("");
  const [labelSearch, setLabelSearch] = useState("");

  const handleFilterByMem = (e) => {
    const data = {
      boardId: boardId,
      users: e?.filter((item) => item.user) || [],
      labels: e?.filter((item) => item.board) || [],
      dueDates: e?.filter((item) => item.now) || [],
    };
    dispatch(getListsByFilter(data));
  };
  const handleChangeUserSearch = (e) => {
    setUserSearch(e.target.value);
  };
  const handleChangeLabelSearch = (e) => {
    setLabelSearch(e.target.value);
  };
  const filteredUsers = selectedBoard?.members?.filter(
    (member) =>
      (member?.name + " " + member?.surname)
        .toLowerCase()
        .includes(userSearch.toLowerCase()) ||
      member?.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredLabels = selectedBoard?.labels?.filter(
    (label) =>
      label?.text?.toLowerCase().includes(labelSearch.toLowerCase()) ||
      label?.color?.toLowerCase().includes(labelSearch.toLowerCase())
  );

  const renderCardLabels =
    selectedBoard &&
    filteredLabels?.map((l, index) => (
      <Flex key={index} justify="space-between">
        <Checkbox
          value={l}
          className="check-box__item"
          //   onChange={(e) => handlefilterByMem(e.target.value)}
        >
          <Tag className="check-box__item-tag" color={l?.type}>
            {l?.text}
          </Tag>
        </Checkbox>
      </Flex>
    ));
  const now = dayjs();
  return (
    <Checkbox.Group
      style={{
        width: "100%",
      }}
      onChange={handleFilterByMem}
    >
      <Flex gap={16} vertical className="filter-content">
        <span className="title-segment">Assign to</span>
        <Flex gap={8} vertical>
          <Input
            type="text"
            onChange={handleChangeUserSearch}
            size="small"
            placeholder="user..."
          />
          <Checkbox value={{ user: "unassign" }}>
            <Flex gap={8} style={{ width: "100%" }} align="center">
              <Avatar
                size={20}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  fontSize: 12,
                }}
              >
                UA
              </Avatar>
              <span>Unassigned</span>
            </Flex>
          </Checkbox>
          {filteredUsers?.map((item) => (
            <Checkbox key={item._id} value={item}>
              <Flex gap={8} style={{ width: "100%" }} align="center">
                <Avatar
                  size={20}
                  style={{ background: item?.color, fontSize: 12 }}
                >
                  {item?.name[0] + item?.surname[0]}
                </Avatar>
                <span>{item?.name + " " + item?.surname}</span>
              </Flex>
            </Checkbox>
          ))}
        </Flex>
        <span className="title-segment">Label/Status</span>
        <Flex gap={8} vertical className="">
          <Input
            type="text"
            onChange={handleChangeLabelSearch}
            size="small"
            placeholder="label..."
          />

          {renderCardLabels}
        </Flex>
        <span className="title-segment">Date</span>
        <Flex gap={8} vertical className="filter-labels">
          <Checkbox value={{ now, type: "nodue" }}>
            <Flex
              gap={8}
              style={{ width: "100%" }}
              align="center"
              className="filter-today"
            >
              <ClockCircleOutlined />
              <span>No Due Date</span>
            </Flex>
          </Checkbox>
          <Checkbox value={{ now, type: "today" }}>
            <Flex
              gap={8}
              style={{ width: "100%" }}
              align="center"
              className="filter-today"
            >
              <ClockCircleOutlined />
              <span>Today due</span>
            </Flex>
          </Checkbox>
          <Checkbox value={{ now, type: "overdue" }}>
            <Flex
              gap={8}
              style={{ width: "100%" }}
              align="center"
              className="filter-overdue"
            >
              <ClockCircleOutlined />
              <span>Over due</span>
            </Flex>
          </Checkbox>
          <Checkbox value={{ now, type: "coming" }}>
            <Flex
              gap={8}
              style={{ width: "100%" }}
              align="center"
              className="filter-coming"
            >
              <ClockCircleOutlined />
              <span>Due date is coming</span>
            </Flex>
          </Checkbox>
        </Flex>
      </Flex>
    </Checkbox.Group>
  );
};

export default BoardFilter;
