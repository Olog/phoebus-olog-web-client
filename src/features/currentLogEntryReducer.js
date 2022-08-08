import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const currentLogEntrySlice = createSlice({
    name: 'currentLogEntry',
    initialState,
    reducers: {
        updateCurrentLogEntry: (state, action) => {
            
            return action.payload;
        }
    }
});

export const { updateCurrentLogEntry } = currentLogEntrySlice.actions;

export default currentLogEntrySlice.reducer;