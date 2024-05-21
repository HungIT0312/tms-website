/* eslint-disable react/prop-types */
import {
  BorderOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Flex,
  Modal,
  Progress,
  Row,
  Statistic,
  Table,
  Input,
  Button,
  Space,
  Skeleton,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardStats } from "../../../api/board/board.api";
import "./Analysis.scss";

const Analysis = ({ isOpen, setIsOpen }) => {
  const { boardId } = useParams();
  const [boardStats, setBoardStats] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
      name: item?.user?.name + " " + item?.user?.surname,
      Tasks: item?.tasks?.totalTask,
      Unresolve: item?.tasks?.unresolve,
      Resolve: item?.tasks?.complete,
      Overdue: item?.tasks?.overdue,
    };
  });

  const total = boardStats?.totalTask;
  const resolvePercent = Math.floor((boardStats?.completeTask / total) * 100);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Tasks",
      dataIndex: "Tasks",
      sorter: (a, b) => a.Tasks - b.Tasks,
    },
    {
      title: "Unresolve",
      dataIndex: "Unresolve",
      sorter: (a, b) => a.Unresolve - b.Unresolve,
    },
    {
      title: "Resolve",
      dataIndex: "Resolve",
      sorter: (a, b) => a.Resolve - b.Resolve,
    },
    {
      title: "Overdue",
      dataIndex: "Overdue",
      sorter: (a, b) => a.Overdue - b.Overdue,
      render: (text) => <div style={{ color: "red" }}>{text}</div>,
    },
  ];

  return (
    <Modal
      title="Analysis"
      centered
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => setIsOpen(false)}
      footer={false}
      className="analysis-model"
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
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
                    <Statistic title="Total Tasks" value={total} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Un-assigned"
                      value={boardStats?.unassignedTask}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8}>
                  <Card>
                    <Statistic
                      title="Resolve"
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
                      title="Unresolve"
                      value={boardStats?.unResolveTask}
                      prefix={<BorderOutlined />}
                      style={{ textWrap: "nowrap", lineBreak: "unset" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8}>
                  <Card>
                    <Statistic
                      title="Overdue Tasks"
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
      )}
    </Modal>
  );
};

export default Analysis;
