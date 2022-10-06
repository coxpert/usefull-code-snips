import React from "react";
import ReactDOM from "react-dom";

import { store, persisStore } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persisStore} loading={null}>
        Import Main App here
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  rootElement
);
