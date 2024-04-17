import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "./user/userSlice";
const rootReducer = combineReducers({
  user: userSlice,
  // Thêm các reducer từ các slice khác vào đây
});
const persistConfig = {
  key: "root",
  storage,
  //   whitelist: ["user"], // Chỉ lưu trữ reducer 'user'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});
// Tạo một Redux Persisted Store
const persistor = persistStore(store);

export { store, persistor };

