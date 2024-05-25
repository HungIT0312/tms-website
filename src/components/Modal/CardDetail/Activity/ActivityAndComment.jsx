import { Tabs } from "antd";
import { useSelector } from "react-redux";
import Activity from "../../../Activity/Activity";

const ActivityAndComment = () => {
  const { selectedCard } = useSelector((state) => state.card);

  const renderActivities = selectedCard?.activities?.map((activity) => (
    <Activity key={activity._id} activity={activity} />
  ));
  const items = [
    // {
    //   key: "1",
    //   label: "T",
    //   children: "Content of Tab Pane 1",
    // },
    {
      key: "2",
      label: "Bình luận",
      children: "Bình luận",
    },
    {
      key: "3",
      label: "Hoạt động",
      children: <>{renderActivities}</>,
    },
  ];
  return <Tabs defaultActiveKey="2" items={items} />;
};

export default ActivityAndComment;
