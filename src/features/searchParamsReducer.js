import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import customization from "utils/customization";
import {v4 as uuidv4} from 'uuid';

const cookies = new Cookies();
const initialState = cookies.get(customization.searchParamsCookie) || {...customization.defaultSearchParams};
cookies.set(customization.searchParamsCookie, initialState, {path: '/', maxAge: '100000000'}); 

const removeEmptyKeys = (obj, exceptions=[]) => {
    const copy = {...obj};
    for(let key of Object.keys(copy).filter(it => exceptions.indexOf(it) === -1)) {
        const val = copy[key];
        if(Array.isArray(val) && val.length === 0) {
            delete copy[key];
            continue;
        }
        if(typeof val === 'string' || val instanceof String) {
            if(val.trim() === '') {
                delete copy[key]
            }
        }
    }
    return copy;
}

export const searchParamsSlice = createSlice({
    name: 'searchParams',
    initialState,
    reducers: {
        updateSearchParams: (state, action) => {
            const searchParams = removeEmptyKeys(action.payload);
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
    return updateSearchParams({
        ...searchParams,
        cacheBust: uuidv4()
    })
}

export const { updateSearchParams } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;