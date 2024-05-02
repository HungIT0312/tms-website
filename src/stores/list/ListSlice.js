import { createSlice } from "@reduxjs/toolkit";
import { createNewList, getAllListByBoardId } from "./ListThunk";

const initialState = {
  lists: [],
  loading: false,
  error: false,
  message: null,
};

const ListSlice = createSlice({
  name: "list",
  initialState,
  reducers: {},
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
      .addCase(createNewList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createNewList.fulfilled, (state, action) => {
        state.loading = false;
        state.lists.push(action.payload);
        state.error = false;
      })
      .addCase(createNewList.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.errMessage;
      });
  },
});

// export const {} = ListSlice.actions;

export default ListSlice.reducer;
