import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import customization from "config/customization";
import { useSelector } from "react-redux";

export const defaultSearchPageParamsState = {
    sort: customization.defaultSortDirection,
    dateDescending: customization.defaultSortDirection === "down",
    from: 0,
    size: customization.defaultPageSize
}
const cookies = new Cookies();

export const searchPageParamsSlice = createSlice({
    name: "searchPageParams",
    initialState: defaultSearchPageParamsState,
    reducers: {
        updateSearchPageParams: (state, action) => {
            const searchPageParams = action.payload;
            cookies.set(customization.searchPageParamsCookie, searchPageParams, {path: '/', maxAge: '100000000'});
            return searchPageParams;
        }
    }
});

export const { updateSearchPageParams } = searchPageParamsSlice.actions;

export const useSearchPageParams = () => useSelector(state => state.searchPageParams);

export default searchPageParamsSlice.reducer;