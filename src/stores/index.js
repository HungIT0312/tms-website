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
// import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Chọn loại lưu trữ, ví dụ: localStorage

// // Import các slice reducer từ các file tương ứng
// import userReducer from "./userSlice";
// // Import các slice reducer khác ở đây

// // Combine các reducer thành một rootReducer
// const rootReducer = combineReducers({
//   user: userReducer,
//   // Thêm các reducer khác vào đây
// });

// // Cấu hình Redux Persist cho rootReducer
// const persistConfig = {
//   key: "root",
//   storage,
//   // whitelist: ['user'], // Nếu bạn muốn chỉ lưu trữ một số reducer cụ thể
//   // blacklist: [], // Nếu bạn muốn loại bỏ một số reducer cụ thể
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Tạo Redux Store và Redux Persist Store
// const store = configureStore({
//   reducer: persistedReducer,
//   // Thêm các middleware, devtools, v.v. ở đây nếu cần thiết
// });

// const persistor = persistStore(store);

// // Xuất Redux Store và Redux Persist Store
// export { store, persistor };
