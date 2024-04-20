import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBoard,
  getAllBoards,
  getBoardById,
} from "../../api/board/board.api";

export const createNewBoard = createAsyncThunk(
  "board/createNewBoard",
  async (boardData, thunkApi) => {
    try {
      const response = await createBoard(boardData);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const getAllUserBoard = createAsyncThunk(
  "board/getAllUserBoard",
  async (user, thunkApi) => {
    try {
      const response = await getAllBoards();
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const getBoard = createAsyncThunk(
  "board/getBoard",
  async (id, thunkApi) => {
    try {
      const response = await getBoardById(id);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
