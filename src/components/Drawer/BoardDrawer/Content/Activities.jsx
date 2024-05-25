/* eslint-disable react/prop-types */
import { Button, Flex } from "antd";
import { useEffect, useState } from "react";
import { getActivityById } from "../../../../api/board/board.api";
import Activity from "../../../Activity/Activity";

const Activities = ({ selectedBoard }) => {
  const [activities, setActivities] = useState([]);
  const [activityLength, setActivityLength] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isMore, setIsMore] = useState(true);
  useEffect(() => {
    try {
      const getActivity = async () => {
        const rs = await getActivityById({
          boardId: selectedBoard?._id,
          page: 1,
          limit,
        });
        if (rs) {
          setActivityLength(rs.length);
          setIsMore(!(rs.length === rs.activities.length));
          setActivities(rs.activities);
          setLimit(rs.limit);
        }
      };
      getActivity();
    } catch (error) {
      console.log(error);
    }
  }, [limit, selectedBoard]);
  const handleSeeMore = () => {
    if (isMore) {
      setLimit((prev) => prev + 10);
    } else {
      setLimit(10);
    }
  };
  return (
    <Flex vertical gap={16} style={{ overflowY: "auto" }}>
      {activities &&
        activities.map((activity) => (
          <Activity key={activity._id} activity={activity} />
        ))}
      {activityLength > 10 && (
        <Button type="text" onClick={handleSeeMore}>
          {isMore ? "Xem thêm" : "Ít hơn"}
        </Button>
      )}
    </Flex>
  );
};

export default Activities;
