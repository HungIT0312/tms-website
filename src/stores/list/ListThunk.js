import { createAsyncThunk } from "@reduxjs/toolkit";
import { changeListOrder, createList, getAllLists } from "../../api/list/list.api";

export const getAllListByBoardId = createAsyncThunk(
  "board/getAllListByBoardId",
  async (id, thunkApi) => {
    try {
      const response = await getAllLists(id);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const createNewList = createAsyncThunk(
  "board/createNewList",
  async (data, thunkApi) => {
    try {
      const response = await createList(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const changeListOrderByIds = createAsyncThunk(
  "board/changeListOrderByIds",
  async (data, thunkApi) => {
    try {
      const response = await changeListOrder(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
