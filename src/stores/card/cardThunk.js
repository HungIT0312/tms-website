import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCard,
  createLabel,
  updateCard,
  updateLabel,
} from "../../api/card/card.api";

export const addCard = createAsyncThunk(
  "board/addCard",
  async (data, thunkApi) => {
    try {
      const response = await createCard(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const updateCardInfo = createAsyncThunk(
  "board/updateCardInfo",
  async (data, thunkApi) => {
    try {
      const { boardId, listId, cardId, updateObj } = data;
      const response = await updateCard(boardId, listId, cardId, updateObj);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const updateCardLabel = createAsyncThunk(
  "board/updateCardLabel",
  async (data, thunkApi) => {
    try {
      const { boardId, listId, cardId, labelId, label } = data;
      const response = await updateLabel(
        boardId,
        listId,
        cardId,
        labelId,
        label
      );
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const createCardLabel = createAsyncThunk(
  "board/createCardLabel",
  async (data, thunkApi) => {
    try {
      const { boardId, listId, cardId, label } = data;
      const response = await createLabel(boardId, listId, cardId, label);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
