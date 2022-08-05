import { configureStore } from "@reduxjs/toolkit";
import searchParamsReducer from "./features/searchParamsReducer";

export const store = configureStore({
    reducer: {
        searchParams: searchParamsReducer
    }
});