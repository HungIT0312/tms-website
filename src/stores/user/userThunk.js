import { createAsyncThunk } from "@reduxjs/toolkit";
import { logInUser, registerUser, searchUser } from "../../api/user/user.api";

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
export const searchUserByKey = createAsyncThunk(
  "user/searchUserByKey",
  async (userData, thunkApi) => {
    try {
      const response = await searchUser(userData);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
