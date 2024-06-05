import { createSlice } from "@reduxjs/toolkit";
import {
  addALabelToCard,
  changeMemberAssign,
  deleteCardById,
  getCardById,
  // addLabelToCard,
  removeLabelFromCard,
  updateCardInfo,
  updateDates,
  uploadFile,
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
      state.selectedCard.date = {
        ...state.selectedCard.date,
        resolvedAt: action.payload.resolvedAt,
        updatedAt: action.payload.updatedAt,
      };
    },
    updateCardDateCompletedUI(state, action) {
      state.selectedCard.date.completed = action.payload;
    },
    updateCardSubTaskUI(state, action) {
      state.selectedCard.subTasks.push(action.payload);
    },
    removeAttachment(state, action) {
      const index = state.selectedCard.attachments.findIndex(
        (a) => a._id == action.payload
      );
      state.selectedCard.attachments.splice(index, 1);
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(updateCardInfo.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateCardInfo.fulfilled, (state, action) => {
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
      })
      //=====================================================================

      .addCase(deleteCardById.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(deleteCardById.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.isLoading = false;
      })
      .addCase(deleteCardById.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      })
      //=======================================================
      .addCase(getCardById.pending, (state) => {
        state.error = false;
        state.isLoading = true;
        state.message = null;
      })
      .addCase(getCardById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCard = action.payload;
      })
      .addCase(getCardById.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.isLoading = false;
        state.error = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        const newData = action.payload.attachment;
        const loadingData = state.selectedCard.attachments.findIndex(
          (a) => a == "upload"
        );
        state.selectedCard.attachments.splice(loadingData, 1);
        state.selectedCard.attachments.push(newData);
      })
      .addCase(uploadFile.pending, (state) => {
        state.selectedCard.attachments.push({
          _id: "upload",
          name: "uploading",
          link: "",
          status: "uploading",
        });
      })
      .addCase(uploadFile.rejected, (state) => {
        const loadingData = state.selectedCard.attachments.findIndex(
          (a) => a == "upload"
        );
        state.selectedCard.attachments.splice(loadingData, 1);
      }),
});

export const {
  setSelectedCard,
  setCardLabelSelected,
  updateCardLabel,
  deleteCardLabel,
  addLabelToCardUI,
  updateCardDateCompletedUI,
  updateCardSubTaskUI,
  updateCardDate,
  removeAttachment,
  uploadFileUI,
} = cardSlice.actions;

export default cardSlice.reducer;
