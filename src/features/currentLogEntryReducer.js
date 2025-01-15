import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = null;

const currentLogEntrySlice = createSlice({
  name: "currentLogEntry",
  initialState,
  reducers: {
    updateCurrentLogEntry: (state, action) => {
      return action.payload;
    }
  }
});

export const { updateCurrentLogEntry } = currentLogEntrySlice.actions;

export const useCurrentLogEntry = () =>
  useSelector((state) => state.currentLogEntry);

export default currentLogEntrySlice.reducer;
