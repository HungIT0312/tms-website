/* eslint-disable react/prop-types */
import { Button, Flex, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { getActivityById } from "../../../../api/board/board.api";
import Activity from "../../../Activity/Activity";

const Activities = ({ selectedBoard }) => {
  const [activities, setActivities] = useState([]);
  const [activityLength, setActivityLength] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isMore, setIsMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    try {
      const getActivity = async () => {
        setIsLoading(true);
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
          setIsLoading(false);
        }
      };
      getActivity();
    } catch (error) {
      message.error("Lỗi dữ liệu");
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
    <Flex
      vertical
      gap={16}
      style={{ overflowY: isLoading ? "hidden" : "auto" }}
    >
      {!isLoading &&
        activities &&
        activities.map((activity) => (
          <Activity key={activity._id} activity={activity} />
        ))}
      {!isLoading && activityLength > 10 && (
        <Button type="text" onClick={handleSeeMore}>
          {isMore ? "Xem thêm" : "Ít hơn"}
        </Button>
      )}
      {isLoading && <Spin />}
    </Flex>
  );
};

export default Activities;
