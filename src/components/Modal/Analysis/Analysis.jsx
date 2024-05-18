/* eslint-disable react/prop-types */
import {
  BorderOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Modal, Progress, Row, Statistic, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardStats } from "../../../api/board/board.api";
import "./Analysis.scss";
const Analysis = ({ isOpen, setIsOpen }) => {
  const { boardId } = useParams();
  const [boardStats, setBoardStats] = useState();

  useEffect(() => {
    try {
      const fetchGetBoardStats = async () => {
        const rs = await getBoardStats(boardId);
        if (rs) {
          setBoardStats(rs);
        }
      };
      fetchGetBoardStats();
    } catch (error) {
      console.log(error);
    }

    return () => {};
  }, [boardId]);
  const total = boardStats?.totalTask;
  const resolvePercent = Math.floor((boardStats?.completeTask / total) * 100);
  //   const unresolvePercent = (boardStats?.unResolveTask / total) * 100;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",

      sorter: (a, b) => a.name.length - b.name.length,
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
  ];
  const data = boardStats?.statsArray?.map((item) => {
    return {
      key: item.user._id,
      name: item?.user?.name + " " + item?.user?.surname,
      Tasks: item?.tasks?.totalTask,
      Unresolve: item?.tasks?.unresolve,
      Resolve: item?.tasks?.complete,
    };
  });
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
      <Flex gap={16} vertical style={{ marginTop: 12 }}>
        <Row gutter={[16, 16]}>
          <Col span={12} style={{ display: "flex", justifyContent: "center" }}>
            <Progress
              percent={resolvePercent}
              success={{
                percent: resolvePercent,
              }}
              type="circle"
              size={240}
            />
          </Col>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card>
                  <Statistic title="Total Tasks" value={total} />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Un-assign"
                    value={boardStats?.unassignedTask}
                  />
                </Card>
              </Col>
              <Col span={8}>
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
              <Col span={8}>
                <Card>
                  <Statistic
                    valueStyle={{
                      color: "#cf1322",
                    }}
                    title="Unresolve"
                    value={boardStats?.unResolveTask}
                    prefix={<BorderOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
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
    </Modal>
  );
};

export default Analysis;
