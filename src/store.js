import { configureStore } from "@reduxjs/toolkit";
import searchPageParamsReducer from "./features/searchPageParamsReducer";
import searchParamsReducer from "./features/searchParamsReducer";
import { ologApi } from "./services/ologApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
    reducer: {
        searchParams: searchParamsReducer,
        searchPageParams: searchPageParamsReducer,
        [ologApi.reducerPath]: ologApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ologApi.middleware),
});

// setupListeners(store.dispatch());