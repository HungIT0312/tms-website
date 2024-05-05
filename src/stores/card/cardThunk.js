import { createAsyncThunk } from "@reduxjs/toolkit";
import { createCard } from "../../api/card/card.api";

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
