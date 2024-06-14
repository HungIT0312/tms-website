/* eslint-disable react/prop-types */
import {
  BorderOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Input,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardStats } from "../../../api/board/board.api";
import { analysisUser } from "../../../api/user/user.api";
import { getCardById } from "../../../stores/card/cardThunk";
import "./Analysis.scss";
import { setSelectedCard } from "../../../stores/card/cardSlice";

const Analysis = ({ isOpen, setIsOpen }) => {
  const { boardId } = useParams();
  const [boardStats, setBoardStats] = useState();
  const { selectedBoard } = useSelector((state) => state.board);

  const [isLoading, setIsLoading] = useState(false);
  const [isSelfStats, setIsSelfStats] = useState(false);
  const [selectedMem, setSelectedMem] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isUserStatsLoading, setIsUserStatsLoading] = useState(false);
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rootLink = location.pathname?.split("/").slice(0, 4).join("/");
  useEffect(() => {
    const fetchGetBoardStats = async () => {
      try {
        setIsLoading(true);
        const rs = await getBoardStats(boardId);
        if (rs) {
          setBoardStats(rs);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGetBoardStats();
  }, [boardId]);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const handleSelectCard = async (card) => {
    await dispatch(getCardById(card?.key)).unwrap();
    const slug = _.kebabCase(card.title.toLowerCase());
    navigate(`${rootLink}/c/${slug}`);
    // .then((rs) => dispatch(setSelectedCard(rs)));
  };
  const checkOwner = (user) => {
    return selectedBoard.members.some(
      (mem) => mem?.user?._id == user?.key && mem?.role == "owner"
    );
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm tên`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const data = boardStats?.statsArray?.map((item) => {
    return {
      key: item.user._id,
      name: item?.user?.fullName,
      Tasks: item?.tasks?.totalTask,
      Unresolve: item?.tasks?.unresolve,
      Resolve: item?.tasks?.complete,
      Overdue: item?.tasks?.overdue,
    };
  });
  const data2 = userStats?.cards?.map((item) => {
    return {
      key: item?._id,
      title: item?.title,
      createdAt: dayjs(item?.createdAt).format("DD-MM-YYYY"),
      dueDate: dayjs(item?.dueDate).format("DD-MM-YYYY"),
      resolvedAt: item?.resolvedAt
        ? dayjs(item?.resolvedAt).format("DD-MM-YYYY")
        : null,
      dueStatus: item?.dueStatus,
      completed: item?.completed,
    };
  });
  const total = boardStats?.totalTask;
  const resolvePercent = Math.floor((boardStats?.completeTask / total) * 100);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Thẻ",
      dataIndex: "Tasks",
      sorter: (a, b) => a.Tasks - b.Tasks,
    },
    {
      title: "Chưa giải quyết",
      dataIndex: "Unresolve",
      sorter: (a, b) => a.Unresolve - b.Unresolve,
    },
    {
      title: "Đã hoàn thành",
      dataIndex: "Resolve",
      sorter: (a, b) => a.Resolve - b.Resolve,
    },
    {
      title: "Quá hạn",
      dataIndex: "Overdue",
      sorter: (a, b) => a.Overdue - b.Overdue,
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, user) => (
        <Button
          onClick={() => {
            setSelectedMem(user);
            setIsSelfStats(true);
            setIsUserStatsLoading(true);
            try {
              const fetchStats = async () => {
                const rs = await analysisUser({
                  userId: user.key,
                  boardId: boardId,
                });
                if (rs) {
                  setUserStats(rs);
                  setIsUserStatsLoading(false);
                }
              };
              fetchStats();
            } catch (error) {
              console.log(error);
              setIsUserStatsLoading(false);
            }
          }}
        >
          <InfoCircleOutlined />
        </Button>
      ),
    },
  ];
  const columns2 = [
    {
      title: "Thẻ",
      dataIndex: "title",
      sorter: (a, b) => a.title - b.title,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: "Ngày đến hạn",
      dataIndex: "dueDate",
      sorter: (a, b) => a.dueDate - b.dueDate,
    },
    {
      title: "Ngày hoàn thành",
      dataIndex: "resolvedAt",
      sorter: (a, b) => a.resolvedAt - b.resolvedAt,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Đến hạn",
      dataIndex: "dueStatus",
      sorter: (a, b) => a.overdue - b.overdue,
      render: (text) => (
        <div>
          {text == "Quá hạn" && (
            <Tag bordered={false} color="volcano">
              {text}
            </Tag>
          )}
          {text !== "Quá hạn" && (
            <Tag bordered={false} color="green">
              {text}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "completed",
      sorter: (a, b) => a.completed - b.completed,
      render: (text) => (
        <div style={{ color: "red" }}>
          {text && <Tag color="success">Đã hoàn thành</Tag>}
          {!text && <Tag color="error">Chưa hoàn thành</Tag>}
        </div>
      ),
    },

    {
      title: "Chi tiết",
      key: "action",
      render: (_, card) => (
        <Button
          onClick={() => {
            handleSelectCard(card);
          }}
        >
          <InfoCircleOutlined />
        </Button>
      ),
    },
  ];
  const ItemPeople = [
    {
      key: "1",
      label: "Họ và tên",
      children: <Flex>{selectedMem?.name}</Flex>,
      span: 3,
    },
    {
      key: "1",
      label: "Vai trò",
      children: (
        <Flex>{checkOwner(selectedMem) ? "Chủ sở hữu" : "Thành viên"}</Flex>
      ),
      span: 3,
    },
  ];
  return (
    <Modal
      title={
        <Flex gap={16}>
          {isSelfStats && (
            <LeftOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setUserStats(null);
                setIsSelfStats(false);
              }}
            />
          )}
          Phân tích
        </Flex>
      }
      centered
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => {
        setIsOpen(false);
        dispatch(setSelectedCard(null));
      }}
      footer={false}
      className="analysis-model"
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : !isSelfStats ? (
        <Flex gap={16} vertical style={{ marginTop: 12 }}>
          <Row gutter={[16, 16]}>
            <Col
              style={{ display: "flex", justifyContent: "center" }}
              sm={24}
              md={12}
            >
              <Progress
                percent={resolvePercent}
                success={{
                  percent: resolvePercent,
                }}
                type="circle"
                size={240}
              />
            </Col>
            <Col sm={24} md={12}>
              <Row gutter={[16, 16]} wrap={true}>
                <Col span={12}>
                  <Card>
                    <Statistic title="Tổng các thẻ" value={total} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Chưa được chỉ định"
                      value={boardStats?.unassignedTask}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8}>
                  <Card>
                    <Statistic
                      title="Đã hoàn thành"
                      valueStyle={{
                        color: "#3f8600",
                      }}
                      value={boardStats?.completeTask}
                      prefix={<CheckSquareOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8}>
                  <Card>
                    <Statistic
                      valueStyle={{
                        color: "#cf1322",
                      }}
                      title="Chưa giải quyết"
                      value={boardStats?.unResolveTask}
                      prefix={<BorderOutlined />}
                      style={{ textWrap: "nowrap", lineBreak: "unset" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8}>
                  <Card>
                    <Statistic
                      title="Quá hạn"
                      value={boardStats?.overdueTask}
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Flex>
      ) : (
        <Flex vertical style={{ marginTop: 24 }}>
          <Descriptions title="" items={ItemPeople} layout="" />
          {/* {isUserStatsLoading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : ( */}
          <Table
            columns={columns2}
            dataSource={data2}
            pagination={false}
            loading={isUserStatsLoading}
          />
          {/* )} */}
        </Flex>
      )}
    </Modal>
  );
};

export default Analysis;
