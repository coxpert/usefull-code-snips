import { combineReducers } from "redux";

import { appReducer } from "./appReducer";
// TODO: import more reducers

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export const rootReducer = combineReducers({
  app: persistReducer(
    {
      key: "appState",
      storage,
    },
    appReducer
    // TODO: List more reducers
  ),
});
