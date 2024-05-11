import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "./user/userSlice";
import boardSlice from "./board/boardSlice";
import invitationSlice from "./invitation/invitationSlice";
import authSlice from "./auth/authSlice";
import ListSlice from "./list/ListSlice";
import cardSlice from "./card/cardSlice";
const rootReducer = combineReducers({
  user: userSlice,
  board: boardSlice,
  invitation: invitationSlice,
  auth: authSlice,
  list: ListSlice,
  card: cardSlice,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "list", "card"],
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
