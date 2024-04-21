import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllInvitations } from "../../api/invitation/invitation.api";

export const getAllInvite = createAsyncThunk(
  "board/getAllInvite",
  async (id, thunkApi) => {
    try {
      const response = await getAllInvitations(id);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
