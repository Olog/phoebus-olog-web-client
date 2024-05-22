import { configureStore } from "@reduxjs/toolkit";
import searchPageParamsReducer from "features/searchPageParamsReducer";
import searchParamsReducer from "features/searchParamsReducer";
import { ologApi } from "api/ologApi";
import currentLogEntryReducer from "features/currentLogEntryReducer";
import userSliceReducer from "./authSlice";
import advancedSearchReducer from "./advancedSearchReducer";

export const setupStore = (preloadedState) => {
    return configureStore({
        reducer: {
            searchParams: searchParamsReducer,
            searchPageParams: searchPageParamsReducer,
            currentLogEntry: currentLogEntryReducer,
            advancedSearch: advancedSearchReducer,
            [ologApi.reducerPath]: ologApi.reducer,
            auth: userSliceReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ologApi.middleware),
        preloadedState
    })
};

export const store = setupStore({});