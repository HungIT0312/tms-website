import { createSlice } from "@reduxjs/toolkit";
import { updateCardInfo } from "./cardThunk";

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
      }),
});

export const { setSelectedCard } = cardSlice.actions;

export default cardSlice.reducer;
