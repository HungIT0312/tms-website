import { Tabs } from "antd";
import { useSelector } from "react-redux";
import Activity from "../../../Activity/Activity";

const ActivityAndComment = () => {
  const { selectedCard } = useSelector((state) => state.card);

  const onChange = (key) => {
    // console.log(key);
  };
  const renderActivities = selectedCard?.activities?.map((activity) => (
    <Activity key={activity._id} activity={activity} />
  ));
  const items = [
    {
      key: "1",
      label: "All",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "Comment",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Activities",
      children: <>{renderActivities}</>,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default ActivityAndComment;
