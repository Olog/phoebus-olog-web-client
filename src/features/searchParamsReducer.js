import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import customization from "config/customization";
import { withCacheBust } from "hooks/useSanitizedSearchParams";

const cookies = new Cookies();
// const initialState = cookies.get(customization.searchParamsCookie) || {...customization.defaultSearchParams};
// cookies.set(customization.searchParamsCookie, initialState, {path: '/', maxAge: '100000000'}); 
export const defaultSearchParamsState = {...customization.defaultSearchParams};

export const searchParamsSlice = createSlice({
    name: 'searchParams',
    initialState: defaultSearchParamsState,
    reducers: {
        updateSearchParams: (state, action) => {
            const searchParams = action.payload;
            cookies.set(customization.searchParamsCookie, searchParams, {path: '/', maxAge: '100000000'}); 
            return searchParams;
        }
    }
})

// This is a workaround to allowing users to force search
// updates from e.g. hitting enter repeatedly on the search box.
// Redux only fires an event if the state has changed
// So we force a change by adding a cacheBust param (which must be
// later removed before an API call)
export const forceUpdateSearchParams = (searchParams) => {
    return updateSearchParams(withCacheBust(searchParams));
}

export const { updateSearchParams } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;