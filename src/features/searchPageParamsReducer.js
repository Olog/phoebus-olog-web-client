import { createSlice } from "@reduxjs/toolkit";
import customization from "../utils/customization";

const initialState = {
    sort: "down",
    from: 0,
    size: customization.defaultPageSize
};

export const searchPageParamsSlice = createSlice({
    name: "searchPageParams",
    initialState,
    reducers: {
        updateSearchPageParams: (state, action) => {
            return action.payload;
        }
    }
});

export const { updateSearchPageParams } = searchPageParamsSlice.actions;

export default searchPageParamsSlice.reducer;