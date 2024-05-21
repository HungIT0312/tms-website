import { createSlice } from "@reduxjs/toolkit";
import { acceptBoardInvite } from "../board/boardThunk";
import { getAllInvite, rejectInvite } from "./invitationThunk";

const initialState = {
  isLoading: false,
  error: false,
  message: null,
  invitations: [],
};

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {
    setAddInvitation(state, action) {
      state.invitations = [...state.invitations, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(acceptBoardInvite.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(acceptBoardInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = state.invitations.map((invitation) =>
          invitation._id === action.payload.invitation._id
            ? { ...invitation, status: "accepted" }
            : invitation
        );
        state.message = action.payload.message;
      })
      .addCase(acceptBoardInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //========================================================
      .addCase(getAllInvite.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(getAllInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = action.payload.reverse();
        state.message = action.payload.message;
      })
      .addCase(getAllInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //==============================================
      .addCase(rejectInvite.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.message = null;
      })
      .addCase(rejectInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = state.invitations.filter(
          (invitation) => invitation._id !== action.payload.invitationId
        );
        state.message = action.payload.message;
      })
      .addCase(rejectInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.errMessage;
        state.error = true;
      });
  },
});

export const { setAddInvitation } = invitationSlice.actions;

export default invitationSlice.reducer;
