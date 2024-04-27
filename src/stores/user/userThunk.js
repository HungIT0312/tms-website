import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  logInUser,
  registerUserByEmail,
  searchUser,
  verifyMail,
} from "../../api/user/user.api";

export const signUpUserByEmail = createAsyncThunk(
  "user/signUpUserByEmail",
  async (userData, thunkApi) => {
    try {
      const response = await registerUserByEmail(userData);
      return response;
    } catch (error) {
      throw thunkApi.rejectWithValue(error);
    }
  }
);
export const verifyMailUser = createAsyncThunk(
  "user/verifyMailUser",
  async (token, thunkApi) => {
    try {
      const response = await verifyMail(token);
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
