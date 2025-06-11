import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { searchParamsSlice } from "./searchParamsReducer";

export const defaultAdvancedSearchState = {
  active: false,
  fieldCount: 0
};

export const advancedSearchSlice = createSlice({
  name: "advancedSearch",
  initialState: defaultAdvancedSearchState,
  extraReducers: (builder) => {
    builder.addCase(
      searchParamsSlice.actions.updateSearchParams,
      (state, action) => {
        const searchParams = action.payload;

        let advancedSearchActive = false;
        let activeFieldCount = 0;

        // Increment field count if advanced-only fields have values
        if (searchParams.attachments) {
          activeFieldCount++;
        }
        if (searchParams.title) {
          activeFieldCount++;
        }
        if (searchParams.desc) {
          activeFieldCount++;
        }
        if (searchParams.start) {
          activeFieldCount++;
        }
        if (searchParams.end) {
          activeFieldCount++;
        }
        if (searchParams.level?.length > 0) {
          activeFieldCount += searchParams.level.length;
        }
        if (searchParams?.logbooks?.length > 0) {
          activeFieldCount += searchParams.logbooks.length;
        }
        if (searchParams?.tags?.length > 0) {
          activeFieldCount += searchParams.tags.length;
        }
        if (searchParams.owner) {
          activeFieldCount++;
        }
        if (searchParams.properties) {
          activeFieldCount++;
        }

        // If any of the advanced-only fields have values
        // then advanced search is active
        if (activeFieldCount > 0) {
          advancedSearchActive = true;
        }

        // update state
        state.active = advancedSearchActive;
        state.fieldCount = activeFieldCount;
        state.groupedReplies = searchParams.groupedReplies;
        state.condensedEntries = searchParams.condensedEntries;
      }
    );
  }
});

export const useAdvancedSearch = () =>
  useSelector((state) => state.advancedSearch);

export default advancedSearchSlice.reducer;
