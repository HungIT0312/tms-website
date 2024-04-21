import { createSlice } from "@reduxjs/toolkit";
import {
  acceptBoardInvite,
  createNewBoard,
  getAllUserBoard,
  getBoard,
} from "./boardThunk";

const initialState = {
  isLoading: false,
  error: false,
  message: null,
  boards: [],
  selectedBoard: {},
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // state.message = action.payload.boards;

      .addCase(createNewBoard.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(createNewBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards.push(action.payload);
      })
      .addCase(createNewBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      })
      // GET BOARDS

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
      })

      // GET BOARD  BY ID

      .addCase(getBoard.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(getBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBoard = action.payload;
      })
      .addCase(getBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      })
      // ACCEPT BOARD INVITATION

      .addCase(acceptBoardInvite.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(acceptBoardInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards.push(action.payload.board);
        state.message = action.payload.message;
      })
      .addCase(acceptBoardInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      });
  },
});

// export const {} = boardSlice.actions;

export default boardSlice.reducer;
