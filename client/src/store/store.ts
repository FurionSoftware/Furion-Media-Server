import { combineReducers, createStore } from "@reduxjs/toolkit";
import layoutSlice from "./layoutSlice"
import librarySlice from "./librarySlice";

const rootReducer = combineReducers({
    layoutReducer: layoutSlice.reducer,
    libraryReducer: librarySlice.reducer
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;