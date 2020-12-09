import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LibraryUpdate {
    id: number,
    updated: boolean
}

type State = {
    librariesUpdated: LibraryUpdate
}

export default createSlice({
    name: "library",
    initialState: {
        librariesUpdated: {}
    } as State,
    reducers: {
        setLibrariesUpdated: (state, action: PayloadAction<LibraryUpdate>) => {
            state.librariesUpdated = { ...action.payload };
        }
    }
})