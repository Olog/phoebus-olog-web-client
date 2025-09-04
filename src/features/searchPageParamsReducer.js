import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import customization from "config/customization";

export const defaultSearchPageParamsState = {
  sort: customization.defaultSortDirection,
  from: 0,
  size: customization.defaultPageSize
};

export const searchPageParamsSlice = createSlice({
  name: "searchPageParams",
  initialState: defaultSearchPageParamsState,
  reducers: {
    toggleSortOrder: (state) => ({
      ...state,
      sort: state.sort === "down" ? "up" : "down"
    }),
    incrementPageSize: (state) => ({
      ...state,
      size: state.size + 50
    })
  }
});

export const { toggleSortOrder, incrementPageSize } =
  searchPageParamsSlice.actions;

export const useSearchPageParams = () =>
  useSelector((state) => state.searchPageParams);

export default searchPageParamsSlice.reducer;
