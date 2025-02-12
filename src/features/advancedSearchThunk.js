import Cookies from "universal-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateSearchParams } from "./searchParamsReducer";
import { updateSearchPageParams } from "./searchPageParamsReducer";
import customization from "config/customization";

const cookies = new Cookies();

export const updateAdvancedSearch = createAsyncThunk(
  "updateAdvancedSearch",
  async (params, { dispatch }) => {
    // Reset page size to default
    dispatch(
      updateSearchPageParams({
        ...cookies.get(customization.searchPageParamsCookie),
        size: customization.defaultPageSize
      })
    );

    // Update search params with new values
    dispatch(updateSearchParams(params));
  }
);
