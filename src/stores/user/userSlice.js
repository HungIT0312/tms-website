import { createSlice } from "@reduxjs/toolkit";
import { setAccessToken, setRefreshToken } from "../../helpers/setToken";
import { signInUserByEmailPass, signUpUser } from "./userThunk";

// Create the auth slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInformation: null,
    message: null,
    loading: false,
    error: false,
  },
  reducers: {
    logOut: (state) => {
      state.userInformation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = false;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //======================================================
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
        state.error = false;
      })
      .addCase(signInUserByEmailPass.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = true;
      });
  },
});
export const { logOut } = userSlice.actions;
export default userSlice.reducer;
