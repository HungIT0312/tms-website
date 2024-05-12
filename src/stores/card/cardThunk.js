import { createAsyncThunk } from "@reduxjs/toolkit";
import { createCard, updateCard } from "../../api/card/card.api";

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
