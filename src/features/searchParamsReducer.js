import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import customization from "../utils/customization";

const cookies = new Cookies();
const initialState = cookies.get(customization.searchParamsCookie) || {...customization.defaultSearchParams};
cookies.set(customization.searchParamsCookie, initialState, {path: '/', maxAge: '100000000'}); 

export const searchParamsSlice = createSlice({
    name: 'searchParams',
    initialState,
    reducers: {
        updateSearchParams: (state, action) => {
            const searchParams = action.payload;
            cookies.set(customization.searchParamsCookie, searchParams, {path: '/', maxAge: '100000000'}); 
            return searchParams;
        }
    }
})

export const { updateSearchParams } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;