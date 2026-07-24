import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./authSlice";
import advancedSearchReducer from "./advancedSearchReducer";
import searchPageParamsReducer from "features/searchPageParamsReducer";
import searchModeReducer from "features/searchModeReducer";
import { ologApi } from "api/ologApi";

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      searchPageParams: searchPageParamsReducer,
      advancedSearch: advancedSearchReducer,
      searchMode: searchModeReducer,
      [ologApi.reducerPath]: ologApi.reducer,
      auth: userSliceReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ologApi.middleware),
    preloadedState
  });
};

export const store = setupStore({});
