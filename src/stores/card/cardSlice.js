import { createSlice } from "@reduxjs/toolkit";
import { createCardLabel, updateCardInfo, updateCardLabel } from "./cardThunk";

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
    setCardLabelSelected(state, action) {
      const initLabels = state.selectedCard.labels;
      state.selectedCard.labels = initLabels.map((item) => {
        if (item._id.toString() === action.payload.labelId.toString()) {
          item.text = action.payload.label.text;
          item.type = action.payload.label.type;
          item.selected = action.payload.label.selected;
        }
        return item;
      });
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
      .addCase(updateCardLabel.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateCardLabel.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.isLoading = false;
      })
      .addCase(updateCardLabel.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //===============================================================

      .addCase(createCardLabel.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(createCardLabel.fulfilled, (state, action) => {
        state.selectedCard.labels.unshift(action.payload.label);
        state.isLoading = false;
      })
      .addCase(createCardLabel.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      }),
});

export const { setSelectedCard, setCardLabelSelected } = cardSlice.actions;

export default cardSlice.reducer;
