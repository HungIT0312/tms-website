import { createSlice } from "@reduxjs/toolkit";
import {
  addALabelToCard,
  changeMemberAssign,
  // addLabelToCard,
  removeLabelFromCard,
  updateCardInfo,
  updateDates,
} from "./cardThunk";

const initialState = {
  isLoading: false,
  isError: false,
  message: null,
  selectedCard: null,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    getCardsStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getCardsSuccess(state, action) {
      return { ...state, cards: action.payload, isLoading: false };
    },
    getCardsFailure(state) {
      state.isError = true;
      state.isLoading = false;
    },
    setSelectedCard(state, action) {
      return { ...state, selectedCard: action.payload };
    },
    deleteCardLabel(state, action) {
      state.selectedCard.labels = state.selectedCard.labels.filter(
        (l) => l._id !== action.payload.label._id
      );
    },
    updateCardLabel(state, action) {
      const updateCardIndex = state.selectedCard.labels.findIndex(
        (l) => l._id === action.payload._id
      );
      state.selectedCard.labels[updateCardIndex] = action.payload;
    },
    addLabelToCardUI(state, action) {
      state.selectedCard.labels.push(action.payload);
    },
    updateCardDate(state, action) {
      state.selectedCard.labels.push(action.payload);
    },
    updateCardDateCompletedUI(state, action) {
      state.selectedCard.date.completed = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(updateCardInfo.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateCardInfo.fulfilled, (state, action) => {
        state.selectedCard = action.payload.card;
        state.message = action.payload.message;
        state.isLoading = false;
      })
      .addCase(updateCardInfo.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //===============================================================
      .addCase(addALabelToCard.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(addALabelToCard.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.selectedCard.labels = action.payload.labels;
        state.isLoading = false;
      })
      .addCase(addALabelToCard.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      // //===============================================================
      .addCase(removeLabelFromCard.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(removeLabelFromCard.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.selectedCard.labels = state.selectedCard.labels.filter(
          (l) => l._id !== action.payload.labelId
        );
        state.isLoading = false;
      })
      .addCase(removeLabelFromCard.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //=====================================================================

      .addCase(updateDates.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateDates.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.isLoading = false;
      })
      .addCase(updateDates.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })

      //=====================================================================
      .addCase(changeMemberAssign.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.selectedCard.members = action.payload.member;
        state.isLoading = false;
      }),
});

export const {
  setSelectedCard,
  setCardLabelSelected,
  updateCardLabel,
  deleteCardLabel,
  addLabelToCardUI,
  updateCardDateCompletedUI,
} = cardSlice.actions;

export default cardSlice.reducer;
