import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllInvitations,
  rejectInvitation,
} from "../../api/invitation/invitation.api";

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
export const rejectInvite = createAsyncThunk(
  "board/rejectInvite",
  async (id, thunkApi) => {
    try {
      const response = await rejectInvitation(id);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
