import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { mapOrder } from "../../helpers/mapOrder";
import { addCard, updateCardInfo } from "../card/cardThunk";
import {
  changeListOrderByIds,
  createNewList,
  deleteListById,
  getAllListByBoardId,
  updateListInfo,
} from "./ListThunk";

const initialState = {
  lists: [],
  storageLists: [],
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
      // eslint-disable-next-line no-unused-vars
      const { listId, cardIds, columnCards } = action.payload;
      const listToUpdate = state.lists.find((list) => list._id === listId);
      if (listToUpdate) {
        listToUpdate.cards = columnCards;
      }
    },

    addACardLabelInList(state, action) {
      const { listId, cardId, label } = action.payload;
      const listToUpdate = state.lists.find((list) => list._id === listId);
      if (listToUpdate) {
        const updatedCards = listToUpdate.cards.map((card) => {
          if (card._id === cardId) {
            const updatedLabels = [...card.labels, label];
            return { ...card, labels: updatedLabels };
          }
          return card;
        });

        state.lists = state.lists.map((list) =>
          list._id === listId ? { ...list, cards: updatedCards } : list
        );
      }
    },
    removeACardLabelInList(state, action) {
      const { listId, cardId, label } = action.payload;
      const listToUpdate = state.lists.find((list) => list._id === listId);
      if (listToUpdate) {
        const updatedCards = listToUpdate.cards.map((card) => {
          if (card._id === cardId) {
            const updatedLabels = card.labels.filter(
              (l) => l._id !== label._id
            );
            return { ...card, labels: updatedLabels };
          }
          return card;
        });

        state.lists = state.lists.map((list) =>
          list._id === listId ? { ...list, cards: updatedCards } : list
        );
      }
    },
    removeLabelFromCardsInAllLists(state, action) {
      const { labelId } = action.payload;
      state.lists.forEach((list) => {
        const updatedCards = list.cards.map((card) => {
          const updatedLabels = card.labels.filter(
            (label) => label._id !== labelId
          );
          return { ...card, labels: updatedLabels };
        });
        list.cards = updatedCards;
      });
    },
    updateLabelInAllCardList(state, action) {
      const label = action.payload;
      state.lists = state.lists.map((list) => {
        const updatedCards = list.cards.map((card) => {
          const updatedLabels = card.labels.map((l) =>
            l._id === label._id ? label : l
          );
          return { ...card, labels: updatedLabels };
        });
        return { ...list, cards: updatedCards };
      });
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
        state.lists = action.payload.filter((l) => l._destroy === false);
        state.storageLists = action.payload.filter((l) => l._destroy === true);
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
      })
      //===========================================================================================================
      .addCase(updateListInfo.pending, (state) => {
        state.error = false;
      })
      .addCase(updateListInfo.fulfilled, (state, action) => {
        const oldList = state.lists;
        const changeList = action.payload.list;
        const indexCrrList = oldList.findIndex((l) => l._id === changeList._id);
        if (changeList._destroy) {
          state.lists.splice(indexCrrList, 1);
          state.storageLists.push(changeList);
        } else if (indexCrrList !== -1) {
          state.lists[indexCrrList].title = changeList.title;
        } else {
          const indexArchive = state.storageLists.findIndex(
            (l) => l._id === changeList._id
          );
          state.storageLists.splice(indexArchive, 1);
          state.lists.push(changeList);
        }
        state.error = false;
      })
      .addCase(updateListInfo.rejected, (state, action) => {
        state.error = true;
        state.message = action.payload.errMessage;
      })
      //===========================================================================================================
      .addCase(deleteListById.pending, (state) => {
        state.error = false;
      })
      .addCase(deleteListById.fulfilled, (state, action) => {
        const newLists = state.storageLists.filter(
          (l) => l._id !== action.payload.list._id
        );
        state.storageLists = newLists;
        state.message = action.payload.message;
        state.error = false;
      })
      .addCase(deleteListById.rejected, (state, action) => {
        state.error = true;
        state.message = action.payload.errMessage;
      })
      //===========================================================================================================
      .addCase(updateCardInfo.pending, (state) => {
        state.error = false;
        state.message = null;
      })
      .addCase(updateCardInfo.fulfilled, (state, action) => {
        const newCard = action.payload.card;
        const indexCrrList = state.lists.findIndex(
          (l) => l._id.toString() === newCard.owner.toString()
        );
        const cardInList = state.lists[indexCrrList].cards.findIndex(
          (c) => c._id === newCard._id
        );
        if (indexCrrList && cardInList) {
          state.lists[indexCrrList].cards[cardInList] = newCard;
        }
        state.message = action.payload.message;
        state.isLoading = false;
      })
      .addCase(updateCardInfo.rejected, (state, action) => {
        state.message = action.payload.errMessage;
        state.error = true;
      });
    //=============================================================================;
  },
});

export const {
  setListsState,
  setCardsState,
  // setCardInfoInList,
  addACardLabelInList,
  removeACardLabelInList,
  removeLabelFromCardsInAllLists,

  updateLabelInAllCardList,
} = ListSlice.actions;

export default ListSlice.reducer;
// setCardInfoInList(state, action) {
//   const { listId, cardId, labelId, label } = action.payload;
//   const listToUpdate = state.lists.find((list) => list._id === listId);
//   if (listToUpdate) {
//     const updatedCards = listToUpdate.cards.map((card) => {
//       if (card._id === cardId) {
//         const updatedLabels = card.labels.map((l) => {
//           if (l._id === labelId) {
//             return {
//               ...l,
//               selected: label.selected,
//               text: label.text,
//               type: label.type,
//             };
//           }
//           return l;
//         });
//         return { ...card, labels: updatedLabels };
//       }
//       return card;
//     });

//     state.lists = state.lists.map((list) =>
//       list._id === listId ? { ...list, cards: updatedCards } : list
//     );
//   }
// },
