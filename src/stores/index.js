import { configureStore } from "@reduxjs/toolkit";
import searchPageParamsReducer from "features/searchPageParamsReducer";
import searchParamsReducer from "features/searchParamsReducer";
import { ologApi } from "services/ologApi";
import currentLogEntryReducer from "features/currentLogEntryReducer";

export const setupStore = (preloadedState) => {
    return configureStore({
        reducer: {
            searchParams: searchParamsReducer,
            searchPageParams: searchPageParamsReducer,
            currentLogEntry: currentLogEntryReducer,
            [ologApi.reducerPath]: ologApi.reducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ologApi.middleware),
        preloadedState
    })
};

export const store = setupStore({});