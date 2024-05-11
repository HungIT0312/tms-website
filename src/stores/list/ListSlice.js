import { createSlice } from "@reduxjs/toolkit";
import {
  changeListOrderByIds,
  createNewList,
  getAllListByBoardId,
} from "./ListThunk";
import { mapOrder } from "../../helpers/mapOrder";
import { addCard } from "../card/cardThunk";
import { cloneDeep } from "lodash";

const initialState = {
  lists: [],
  loading: false,
  error: false,
  message: null,
};

const ListSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setListsState: (state, action) => {
      state.lists = action.payload;
    },
    setCardsState: (state, action) => {
      const { listId, cardIds, columnCards } = action.payload;
      const listToUpdate = state.lists.find((list) => list._id === listId);
      if (listToUpdate) {
        listToUpdate.cards = columnCards;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllListByBoardId.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllListByBoardId.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
        state.error = false;
      })
      .addCase(getAllListByBoardId.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.errMessage;
      })
      //===========================================================================================================

      .addCase(createNewList.pending, (state) => {
        state.error = false;
      })
      .addCase(createNewList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
        state.error = false;
      })
      .addCase(createNewList.rejected, (state, action) => {
        state.error = true;
        state.message = action.payload.errMessage;
      })
      //===========================================================================================================
      .addCase(changeListOrderByIds.pending, (state) => {
        state.error = false;
      })
      .addCase(changeListOrderByIds.fulfilled, (state, action) => {
        const oldList = state.lists;
        const newList = mapOrder(oldList, action.payload.lists, "_id");
        state.lists = newList;
        state.error = false;
      })
      .addCase(changeListOrderByIds.rejected, (state, action) => {
        state.error = true;
        state.message = action.payload.errMessage;
      })
      //===========================================================================================================
      .addCase(addCard.pending, (state) => {
        state.error = false;
      })
      .addCase(addCard.fulfilled, (state, action) => {
        const currentLists = cloneDeep(state.lists);
        const listIndex = currentLists?.findIndex(
          (list) => list._id === action.payload.card.owner
        );
        if (listIndex !== -1) {
          const newCard = [
            ...currentLists[listIndex].cards,
            action.payload.card,
          ];
          state.lists[listIndex].cards = newCard;
        } else {
          console.log("Can't add card to the list."); // eslint-disable-line no-console
        }
        state.error = false;
      })
      .addCase(addCard.rejected, (state, action) => {
        state.error = true;
        state.message = action.payload.errMessage;
      });
  },
});

export const { setListsState, setCardsState } = ListSlice.actions;

export default ListSlice.reducer;
