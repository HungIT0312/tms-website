import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "./user/userSlice";
import boardSlice from "./board/boardSlice";
import invitationSlice from "./invitation/invitationSlice";
import authSlice from "./auth/authSlice";
import ListSlice from "./list/ListSlice";
const rootReducer = combineReducers({
  user: userSlice,
  board: boardSlice,
  invitation: invitationSlice,
  auth: authSlice,
  list: ListSlice,
  // Thêm các reducer từ các slice khác vào đây
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "list"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
// Tạo một Redux Persisted Store
const persistor = persistStore(store);

export { store, persistor };
