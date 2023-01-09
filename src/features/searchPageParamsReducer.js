import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import customization from "utils/customization";

const cookies = new Cookies();
const initialState = cookies.get(customization.searchPageParamsCookie) || {
    sort: "down",
    from: 0,
    size: customization.defaultPageSize
};
cookies.set(customization.searchPageParamsCookie, initialState, {path: '/', maxAge: '100000000'});

export const searchPageParamsSlice = createSlice({
    name: "searchPageParams",
    initialState,
    reducers: {
        updateSearchPageParams: (state, action) => {
            const searchPageParams = action.payload;
            cookies.set(customization.searchPageParamsCookie, searchPageParams, {path: '/', maxAge: '100000000'});
            return searchPageParams;
        }
    }
});

export const { updateSearchPageParams } = searchPageParamsSlice.actions;

export default searchPageParamsSlice.reducer;