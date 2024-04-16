import { createAsyncThunk } from "@reduxjs/toolkit";
import { logInUser, registerUser } from "../../api/user/user.api";

export const signUpUser = createAsyncThunk(
  "user/registerUser",
  async (userData, thunkApi) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);

export const signInUserByEmailPass = createAsyncThunk(
  "user/login",
  async (userData, thunkApi) => {
    try {
      const response = await logInUser(userData);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
