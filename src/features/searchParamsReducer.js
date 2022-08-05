import { createSlice } from "@reduxjs/toolkit";
import customization from "../utils/customization";

const initialState = {...customization.defaultSearchParams};

export const searchParamsSlice = createSlice({
    name: 'searchParams',
    initialState,
    reducers: {
        updateSearchParams: (state, action) => {
            return action.payload
        }
    }
})

export const { updateSearchParams } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;