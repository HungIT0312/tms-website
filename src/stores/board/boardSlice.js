import { createSlice } from "@reduxjs/toolkit";
import boardProperty from "../../constants/boardProperty";
import {
  acceptBoardInvite,
  createNewBoard,
  getAllUserBoard,
  getBoard,
  removeMemberInBoard,
  updateBoardInfo,
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
        state.selectedBoard = {
          ...action.payload,
          members: action.payload.members.reverse(),
        };
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
      })
      //=====================================================

      .addCase(removeMemberInBoard.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(removeMemberInBoard.fulfilled, (state, action) => {
        state.selectedBoard = {
          ...state.selectedBoard,
          members: state.selectedBoard.members.filter(
            (member) =>
              member.user.toString() !== action.payload.removedMemberId
          ),
        };
        state.error = false;
        state.message = action.payload.message;
      })
      .addCase(removeMemberInBoard.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      // UPDATE BOARD INFO

      .addCase(updateBoardInfo.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateBoardInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        if (payload.property === boardProperty.BACKGROUND) {
          state.selectedBoard.backgroundImageLink = payload.newValue.link;
          state.selectedBoard.isImage = payload.newValue.isImage;
        } else state.selectedBoard[payload.property] = payload.newValue;
        state.message = payload.message;
      })
      .addCase(updateBoardInfo.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      });
  },
});

// export const {} = boardSlice.actions;

export default boardSlice.reducer;
