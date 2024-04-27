import { createSlice } from "@reduxjs/toolkit";
import { signUpUserByEmail, verifyMailUser } from "../user/userThunk";
const initialState = {
  message: null,
  loading: false,
  error: false,
  verified: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setMessage(state, action) {
      state.message = action.payload;
    },
    resetAuthData() {
      return { ...initialState };
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
      .addCase(verifyMailUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(verifyMailUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.verified = action.payload.verified;
        state.error = false;
      })
      .addCase(verifyMailUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      });
    //=================================================================================
  },
});
// export const {  } = authSlice.actions;
export default authSlice.reducer;
