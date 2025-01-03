import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { searchParamsSlice } from "./searchParamsReducer";

export const defaultAdvancedSearchState = {
  active: false,
  fieldCount: 0,
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
        searchParams.attachments && activeFieldCount++;
        searchParams.title && activeFieldCount++;
        searchParams.desc && activeFieldCount++;
        searchParams.start && activeFieldCount++;
        searchParams.end && activeFieldCount++;
        searchParams.level && activeFieldCount++;
        searchParams?.logbooks?.length > 0 && activeFieldCount++;
        searchParams?.tags?.length > 0 && activeFieldCount++;
        searchParams.owner && activeFieldCount++;
        searchParams.properties && activeFieldCount++;

        // If any of the advanced-only fields have values
        // then advanced search is active
        if (activeFieldCount > 0) {
          advancedSearchActive = true;
        }

        // update state
        state.active = advancedSearchActive;
        state.fieldCount = activeFieldCount;
      }
    );
  },
});

export const useAdvancedSearch = () =>
  useSelector((state) => state.advancedSearch);

export default advancedSearchSlice.reducer;
