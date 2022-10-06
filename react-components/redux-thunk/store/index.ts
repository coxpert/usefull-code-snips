import { createStore } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { rootReducer } from "./reducers";

const persistConfig = {
  key: "root",
  storage,
};

export const store = createStore(persistReducer(persistConfig, rootReducer));

export const persisStore = persistStore(store);

export type AppDispatch = typeof store.dispatch;
