import { configureStore } from "@reduxjs/toolkit";
import searchPageParamsReducer from "./features/searchPageParamsReducer";
import searchParamsReducer from "./features/searchParamsReducer";

export const store = configureStore({
    reducer: {
        searchParams: searchParamsReducer,
        searchPageParams: searchPageParamsReducer
    }
});