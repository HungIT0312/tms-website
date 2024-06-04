import { createSlice } from "@reduxjs/toolkit";
import {
  deleteCookie,
  setAccessToken,
  setRefreshToken,
} from "../../helpers/setToken";
import { signInUserByEmailPass, signUpUserByEmail } from "./userThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInformation: null,
    message: null,
    loading: false,
    error: false,
    isLogin: false,
  },
  reducers: {
    logOut: (state) => {
      state.userInformation = null;
      state.message = null;
      state.loading = false;
      state.error = false;
      state.isLogin = false;
      deleteCookie();
      window.localStorage.clear();
    },
    updateUserInfoUI: (state, action) => {
      state.userInformation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //=================================================================================
      .addCase(signUpUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(signUpUserByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = false;
      })
      .addCase(signUpUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //=================================================================================

      .addCase(signInUserByEmailPass.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(signInUserByEmailPass.fulfilled, (state, action) => {
        state.loading = false;
        state.userInformation = action.payload.user;
        state.message = action.payload.message;
        setRefreshToken(action.payload.tokens.refreshToken);
        setAccessToken(action.payload.tokens.accessToken);
        state.isLogin = true;
        state.error = false;
      })
      .addCase(signInUserByEmailPass.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.errMessage;
        state.error = true;
        state.isLogin = false;
      });
  },
});
export const { logOut, updateUserInfoUI } = userSlice.actions;
export default userSlice.reducer;
