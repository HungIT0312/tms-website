/* eslint-disable react/prop-types */
import { Empty } from "antd";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { readAll } from "../../../api/notification/notification.api";
import { setCountBefore } from "../../../stores/notice/noticeSlice";
import NotificationItem from "./NotificationItem";
const NotificationPopup = ({ notifications = [] }) => {
  const revertNotice =
    notifications.length > 0 ? [...notifications].reverse() : notifications;
  const dispatch = useDispatch();
  const noticeIds = useMemo(
    () => notifications?.filter((n) => !n.read).map((n) => n._id),
    [notifications]
  );

  useEffect(() => {
    if (noticeIds?.length > 0) {
      setTimeout(async () => {
        dispatch(setCountBefore());
        try {
          await readAll(noticeIds);
        } catch (error) {
          console.log(error);
        }
      }, 3000);
    }
  }, [dispatch, noticeIds]);

  return (
    <div className="invitation_popup">
      <div className="invitation__title">Thông báo</div>
      <div className="invitation__content" style={{ padding: 8 }}>
        {notifications.length > 0 &&
          revertNotice.map((notice) => (
            <NotificationItem key={notice?._id} notice={notice} />
          ))}
        {notifications.length < 1 && (
          <Empty description={"Không có thông báo."} />
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
