import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import customization from "config/customization";

export const defaultSearchPageParamsState = {
  sort: customization.defaultSortDirection,
  dateDescending: customization.defaultSortDirection === "down",
  from: 0,
  size: customization.defaultPageSize
};
const cookies = new Cookies();

export const searchPageParamsSlice = createSlice({
  name: "searchPageParams",
  initialState: defaultSearchPageParamsState,
  reducers: {
    updateSearchPageParams: (state, action) => {
      const searchPageParams = action.payload;
      cookies.set(customization.searchPageParamsCookie, searchPageParams, {
        path: "/",
        maxAge: 100000000
      });
      return searchPageParams;
    },
    incrementPageSize: (state) => ({
      ...state,
      size: state.size + 50
    })
  }
});

export const { updateSearchPageParams, incrementPageSize } =
  searchPageParamsSlice.actions;

export const useSearchPageParams = () =>
  useSelector((state) => state.searchPageParams);

export default searchPageParamsSlice.reducer;
