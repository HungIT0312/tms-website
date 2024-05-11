import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setSelectedCard } = cardSlice.actions;

export default cardSlice.reducer;
