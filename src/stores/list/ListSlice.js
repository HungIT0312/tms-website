import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { mapOrder } from "../../helpers/mapOrder";
import { addCard, updateCardInfo } from "../card/cardThunk";
import {
  changeCardToDiffList,
  changeListOrderByIds,
  createNewList,
  deleteListById,
  getAllListByBoardId,
  getListsByFilter,
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
    changeCardToAnotherList: (state, action) => {
      const { newListId, card } = action.payload;
      const newCard = { ...card, owner: newListId };
      const oldListIndex = state.lists.findIndex(
        (list) => list._id === card.owner
      );
      const newListIndex = state.lists.findIndex(
        (list) => list._id === newListId
      );

      if (oldListIndex === -1 || newListIndex === -1) {
        return;
      }

      const updatedOldList = { ...state.lists[oldListIndex] };
      const updatedNewList = { ...state.lists[newListIndex] };

      updatedOldList.cards = updatedOldList.cards.filter(
        (c) => c._id !== newCard._id
      );
      updatedNewList.cards = [...updatedNewList.cards, newCard];

      state.lists[oldListIndex] = updatedOldList;
      state.lists[newListIndex] = updatedNewList;
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
    updateDateCardListUI(state, action) {
      const { cardId, listId, date } = action.payload;
      state.lists = state.lists.map((list) => {
        if (list._id === listId) {
          const updatedCards = list.cards.map((card) => {
            if (card._id === cardId) {
              const updatedDate = { ...card.date, ...date };
              return { ...card, date: updatedDate };
            }
            return card;
          });
          return { ...list, cards: updatedCards };
        }

        return list;
      });
    },
    updateCardMemberUI(state, action) {
      const { cardId, listId, member } = action.payload;
      state.lists = state.lists.map((list) => {
        if (list._id === listId) {
          const updatedCards = list.cards.map((card) => {
            if (card._id === cardId) {
              return { ...card, members: member };
            }
            return card;
          });
          return { ...list, cards: updatedCards };
        }

        return list;
      });
    },
    removeBoardMemberUI(state, action) {
      const { memberId } = action.payload;
      state.lists = state.lists.map((list) => {
        const updatedCards = list.cards.map((card) => {
          const updatedMembers = card.members.filter(
            (member) => member.user._id.toString() != memberId.toString()
          );
          return { ...card, members: updatedMembers };
        });
        return { ...list, cards: updatedCards };
      });
    },

    deleteCardInListById(state, action) {
      const { cardId, parentCardId, deleteSubtasks } = action.payload;

      const gatherSubtaskIds = (cards, cardId, ids = new Set()) => {
        for (let card of cards) {
          if (card._id === cardId) {
            ids.add(card._id);
            if (card.subTasks && card.subTasks.length > 0) {
              card.subTasks.forEach((subTaskId) =>
                gatherSubtaskIds(cards, subTaskId, ids)
              );
            }
            break;
          }
        }
        return ids;
      };

      const cardIdsToRemove = gatherSubtaskIds(
        state.lists.flatMap((list) => list.cards),
        cardId
      );

      state.lists = state.lists.map((list) => {
        if (deleteSubtasks) {
          // Remove the card and its subtasks from each list
          list.cards = list.cards.filter(
            (card) => !cardIdsToRemove.has(card._id)
          );
          if (parentCardId) {
            list.cards = list.cards.map((card) => {
              if (card._id === parentCardId) {
                return {
                  ...card,
                  subTasks: card.subTasks.filter(
                    (subTaskId) => !cardIdsToRemove.has(subTaskId)
                  ),
                };
              }
              return card;
            });
          }
        } else {
          // Remove only the card itself, but update subtasks
          list.cards = list.cards.filter((card) => card._id !== cardId);
          if (parentCardId) {
            list.cards = list.cards.map((card) => {
              if (card._id === parentCardId) {
                return {
                  ...card,
                  subTasks: card.subTasks.filter(
                    (subTaskId) => subTaskId !== cardId
                  ),
                };
              }
              return card;
            });
          }
          // Update subtasks to remove isSubTaskOf
          list.cards = list.cards.map((card) => {
            if (cardIdsToRemove.has(card._id)) {
              return { ...card, isSubTaskOf: null };
            }
            return card;
          });
        }
        return list;
      });
    },
    updateCardInListById(state, action) {
      const { listId, cardId, updateObj } = action.payload;
      state.lists = state.lists.map((list) => {
        if (list._id === listId) {
          list.cards = list.cards.map((card) => {
            if (card._id === cardId) {
              return { ...card, ...updateObj };
            }
            return card;
          });
        }
        return list;
      });
    },
    updateParentCardUI(state, action) {
      const { listId, parentCardId, newCard } = action.payload;

      state.lists = state.lists.map((list) => {
        if (list._id === listId) {
          list.cards = list.cards.map((card) => {
            if (card._id === parentCardId) {
              return {
                ...card,
                subTasks: [...(card.subTasks || []), newCard._id],
              };
            }
            return card;
          });
        }
        return list;
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
          state.lists[indexCrrList] = changeList;
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
      })
      //=============================================================================;
      .addCase(getListsByFilter.fulfilled, (state, action) => {
        state.loading = false;
        const newList = mapOrder(
          action.payload,
          state.lists.map((l) => l._id),
          "_id"
        );
        state.lists = newList.filter((l) => l._destroy === false);
        // state.storageLists = action.payload.filter((l) => l._destroy === true);
        state.error = false;
      })
      .addCase(getListsByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.errMessage;
      })
      .addCase(changeCardToDiffList.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      });

    //=============================================================================;
  },
});

export const {
  setListsState,
  setCardsState,
  addACardLabelInList,
  removeACardLabelInList,
  removeLabelFromCardsInAllLists,
  updateDateCardListUI,
  updateLabelInAllCardList,
  updateCardMemberUI,
  removeBoardMemberUI,
  deleteCardInListById,
  updateCardInListById,
  changeCardToAnotherList,
  updateParentCardUI,
} = ListSlice.actions;

export default ListSlice.reducer;
