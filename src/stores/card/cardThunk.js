import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCardLabel,
  changeMemberCard,
  createCard,
  deleteCard,
  getCard,
  removeCardLabel,
  updateCard,
  updateDateCompleted,
  updateStartDueDates,
} from "../../api/card/card.api";

export const addCard = createAsyncThunk(
  "card/addCard",
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
  "card/updateCardInfo",
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
export const removeLabelFromCard = createAsyncThunk(
  "card/removeLabelFromCard",
  async (data, thunkApi) => {
    try {
      const response = await removeCardLabel(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const addALabelToCard = createAsyncThunk(
  "card/addALabelToCardSelected",
  async (data, thunkApi) => {
    try {
      const response = await addCardLabel(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const updateDates = createAsyncThunk(
  "board/updateDates",
  async (data, thunkApi) => {
    try {
      const response = await updateStartDueDates(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const updateCardDateCompleted = createAsyncThunk(
  "board/updateCardDateCompleted",
  async (data, thunkApi) => {
    try {
      const response = await updateDateCompleted(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const changeMemberAssign = createAsyncThunk(
  "board/changeMemberAssign",
  async (data, thunkApi) => {
    try {
      const response = await changeMemberCard(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const deleteCardById = createAsyncThunk(
  "board/deleteCardById",
  async (data, thunkApi) => {
    try {
      const response = await deleteCard(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const getCardById = createAsyncThunk(
  "board/getCardById",
  async (data, thunkApi) => {
    try {
      const response = await getCard(data);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
