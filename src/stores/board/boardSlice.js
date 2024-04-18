import { createSlice } from "@reduxjs/toolkit";
import { createNewBoard, getAllUserBoard } from "./boardThunk";

const initialState = {
  isLoading: false,
  error: false,
  message: null,
  boards: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewBoard.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(createNewBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards.push(action.payload);
        // state.message = action.payload.boards;
      })
      .addCase(createNewBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      })
      .addCase(getAllUserBoard.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(getAllUserBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards = action.payload;
      })
      .addCase(getAllUserBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      });
  },
});

// export const {} = boardSlice.actions;

export default boardSlice.reducer;
