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
    const completedItems = e.filter(
      (item) => item.completed === true || item.completed === false
    );
    const completed =
      completedItems.length > 0 ? completedItems[0].completed : undefined;

    const data = {
      boardId: boardId,
      users: e?.filter((item) => item.user) || [],
      labels: e?.filter((item) => item.board) || [],
      dueDates: e?.filter((item) => item.now) || [],
      completed: completed,
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
        <span className="title-segment">Chỉ định cho</span>
        <Flex gap={8} vertical>
          <Input
            type="text"
            onChange={handleChangeUserSearch}
            size="small"
            placeholder="người dùng..."
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
              <span>Chưa chỉ định</span>
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
        <span className="title-segment">Trạng thái</span>
        <Flex gap={8} vertical className="">
          <Flex justify="space-between">
            <Checkbox
              key={{ completed: true }}
              value={{ completed: true }}
              className="check-box__item"
            >
              Hoàn thành
            </Checkbox>
          </Flex>
          <Flex justify="space-between">
            <Checkbox
              key={{ completed: false }}
              value={{ completed: false }}
              className="check-box__item"
            >
              Chưa hoàn thành
            </Checkbox>
          </Flex>
        </Flex>
        <span className="title-segment">Nhãn</span>
        <Flex gap={8} vertical className="">
          <Input
            type="text"
            onChange={handleChangeLabelSearch}
            size="small"
            placeholder="nhãn..."
          />

          {renderCardLabels}
        </Flex>
        <span className="title-segment">Ngày</span>
        <Flex gap={8} vertical className="filter-labels">
          <Checkbox value={{ now, type: "nodue" }}>
            <Flex
              gap={8}
              style={{ width: "100%" }}
              align="center"
              className="filter-today"
            >
              <ClockCircleOutlined />
              <span>Không có hạn</span>
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
              <span>Đến hạn hôm nay</span>
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
              <span>Quá hạn</span>
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
              <span>Đang đến</span>
            </Flex>
          </Checkbox>
        </Flex>
      </Flex>
    </Checkbox.Group>
  );
};

export default BoardFilter;
