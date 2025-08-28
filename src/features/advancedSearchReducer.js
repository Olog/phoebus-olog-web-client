import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const defaultAdvancedSearchState = {
  groupedReplies: true,
  condensedEntries: false
};

export const advancedSearchSlice = createSlice({
  name: "advancedSearch",
  initialState: defaultAdvancedSearchState,
  reducers: {
    updateAdvancedSearch: (state, action) => ({
      ...state,
      ...action.payload
    })
  }
});

export const { updateAdvancedSearch } = advancedSearchSlice.actions;

export const useAdvancedSearch = () =>
  useSelector((state) => state.advancedSearch);

export default advancedSearchSlice.reducer;
