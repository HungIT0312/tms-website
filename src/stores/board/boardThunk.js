import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBoard,
  createLabel,
  deleteLabel,
  getAllBoards,
  getBoardById,
  removeMemberInBoardById,
  updateBoard,
  updateLabel,
} from "../../api/board/board.api";
import { acceptInvitation } from "../../api/invitation/invitation.api";

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
export const acceptBoardInvite = createAsyncThunk(
  "board/acceptBoardInvite",
  async (id, thunkApi) => {
    try {
      const response = await acceptInvitation(id);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const removeMemberInBoard = createAsyncThunk(
  "board/removeMemberInBoard",
  async (data, thunkApi) => {
    try {
      const response = await removeMemberInBoardById(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const updateBoardInfo = createAsyncThunk(
  "board/updateBoardInfo",
  async (data, thunkApi) => {
    try {
      const response = await updateBoard(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const updateBoardLabel = createAsyncThunk(
  "board/updateBoardLabel",
  async (data, thunkApi) => {
    try {
      const response = await updateLabel(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const createBoardLabel = createAsyncThunk(
  "board/createBoardLabel",
  async (data, thunkApi) => {
    try {
      const response = await createLabel(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const deleteBoardLabel = createAsyncThunk(
  "board/deleteBoardLabel",
  async (data, thunkApi) => {
    try {
      const response = await deleteLabel(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
