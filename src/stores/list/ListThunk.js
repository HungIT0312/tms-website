import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  changeListOrder,
  createList,
  deleteList,
  getAllListByFilter,
  getAllLists,
  updateList,
} from "../../api/list/list.api";

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
export const updateListInfo = createAsyncThunk(
  "board/updateListInfo",
  async (data, thunkApi) => {
    try {
      const { boardId, listId, value, property } = data;

      const response = await updateList(boardId, listId, value, property);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const deleteListById = createAsyncThunk(
  "board/deleteListById",
  async (data, thunkApi) => {
    try {
      const { boardId, listId } = data;
      const response = await deleteList(boardId, listId);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const getListsByFilter = createAsyncThunk(
  "board/getListsByFilter",
  async (data, thunkApi) => {
    try {
      const response = await getAllListByFilter(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);