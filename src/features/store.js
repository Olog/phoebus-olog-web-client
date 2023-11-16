import { configureStore } from "@reduxjs/toolkit";
import searchPageParamsReducer from "features/searchPageParamsReducer";
import searchParamsReducer from "features/searchParamsReducer";
import { ologApi } from "api/ologApi";
import currentLogEntryReducer from "features/currentLogEntryReducer";
import userSliceReducer from "./authSlice";

export const setupStore = (preloadedState) => {
    return configureStore({
        reducer: {
            searchParams: searchParamsReducer,
            searchPageParams: searchPageParamsReducer,
            currentLogEntry: currentLogEntryReducer,
            [ologApi.reducerPath]: ologApi.reducer,
            auth: userSliceReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ologApi.middleware),
        preloadedState
    })
};

export const store = setupStore({});