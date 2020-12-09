import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
    selectedNavKeys: string[]
}

export default createSlice({
    name: "layout",
    initialState: {
        selectedNavKeys: []
    } as State,
    reducers: {
        setSelectedNavKeys: (state, action: PayloadAction<string[]>) => {
            state.selectedNavKeys = action.payload;
        }
    }
})