import { createSlice } from "@reduxjs/toolkit";
import { getAllNoticeById } from "./noticeThunk";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    newMessageCount: 0,
  },
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
      const newNoticeCount = state.notifications?.reduce(
        (count, notification) => {
          return !notification.read ? count + 1 : count;
        },
        0
      );
      state.newMessageCount = newNoticeCount;
    },
    setCountBefore(state) {
      state.notifications = state.notifications.map((n) => {
        if (!n.read) {
          return { ...n, read: true };
        }
        return n;
      });

      state.newMessageCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllNoticeById.fulfilled, (state, action) => {
      state.notifications = action.payload;
      const newNoticeCount = state.notifications?.reduce(
        (count, notification) => {
          return !notification.read ? count + 1 : count;
        },
        0
      );
      state.newMessageCount = newNoticeCount;
    });
  },
});
export const { setNotifications, setCountBefore } = notificationSlice.actions;
export default notificationSlice.reducer;
