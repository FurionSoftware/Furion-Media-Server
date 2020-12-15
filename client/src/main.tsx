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
window["__onGCastApiAvailable"] = function (isAvailable: any) {
	if (isAvailable) {
		initializeCastApi();
	}
};
function initializeCastApi() {
	cast.framework.CastContext.getInstance().setOptions({
		receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
		autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
	});
	cast.framework.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
}
if (process.env.NODE_ENV === "development") {
	Axios.defaults.baseURL = "http://localhost:8000/api";
}
ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
