import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Axios from "axios";
import { Provider } from "react-redux";
import { store } from "./store/store";

if (process.env.NODE_ENV === "development") {
  Axios.defaults.baseURL = "http://localhost:8000/api";
}
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
