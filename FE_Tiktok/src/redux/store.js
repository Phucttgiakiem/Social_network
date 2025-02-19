import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Lưu vào localStorage
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./reducers"; 

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
