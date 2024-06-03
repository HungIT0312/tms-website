import { createSlice } from "@reduxjs/toolkit";
import {
  acceptBoardInvite,
  createBoardLabel,
  createNewBoard,
  deleteBoardLabel,
  getAllUserBoard,
  getBoard,
  removeMemberInBoard,
  updateBoardInfo,
  updateBoardLabel,
} from "./boardThunk";

const initialState = {
  isLoading: false,
  error: false,
  message: null,
  boards: [],
  storageBoards: [],
  selectedBoard: {},
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addBoardLabelUI(state, action) {
      state.selectedBoard.labels.push(action.payload);
    },
    changeBg(state, action) {
      state.selectedBoard.backgroundImageLink = action.payload;
    },
    removeBoard(state, action) {
      state.boards = state.boards.filter((b) => b._id !== action.payload);
    },
  },
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
        // state.boards = action.payload;
        state.boards = action.payload.filter((b) => b._destroy === false);
        state.storageBoards = action.payload.filter((b) => b._destroy === true);
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
      // UPDATE BOARD INFO==========================================

      .addCase(updateBoardInfo.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateBoardInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        // if (payload.property === boardProperty.BACKGROUND) {
        //   state.selectedBoard.backgroundImageLink = payload.newValue.link;
        //   state.selectedBoard.isImage = payload.newValue.isImage;
        // } else state.selectedBoard[payload.property] = payload.newValue;
        state.message = payload.message;
      })
      .addCase(updateBoardInfo.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //======================================================
      .addCase(createBoardLabel.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(createBoardLabel.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        const index = state.selectedBoard.labels.findIndex(
          (label) => !label._id
        );
        if (index !== -1) {
          state.selectedBoard.labels[index] = payload.label;
        } else {
          state.selectedBoard.labels.push(payload.label);
        }
        state.message = payload.message;
      })
      .addCase(createBoardLabel.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //==================================================================
      .addCase(updateBoardLabel.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateBoardLabel.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        const labelIndex = state.selectedBoard.labels.findIndex(
          (l) => l._id === action.payload.label._id
        );
        state.selectedBoard.labels[labelIndex] = action.payload.label;
        state.message = payload.message;
      })
      .addCase(updateBoardLabel.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //===================================================================
      .addCase(deleteBoardLabel.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(deleteBoardLabel.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.selectedBoard.labels = state.selectedBoard.labels.filter(
          (l) => l._id !== action.payload.label._id
        );
        state.message = payload.message;
      })
      .addCase(deleteBoardLabel.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      });
  },
});

export const { addBoardLabelUI, changeBg, removeBoard } = boardSlice.actions;

export default boardSlice.reducer;
