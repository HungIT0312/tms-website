import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllNotice } from "../../api/notification/notification.api";

export const getAllNoticeById = createAsyncThunk(
  "board/getAllNoticeById",
  async (data, thunkApi) => {
    try {
      const response = await getAllNotice();
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
