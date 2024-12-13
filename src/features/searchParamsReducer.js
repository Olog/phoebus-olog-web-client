import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import customization from "config/customization";
import { useSelector } from "react-redux";

const cookies = new Cookies();

export const defaultSearchParams = {
  query: "",
  title: "",
  desc: "",
  owner: "",
  level: undefined,
  start: undefined,
  end: undefined,
  logbooks: [],
  tags: [],
  attachments: "",
};
export const defaultSearchParamsState = {
  ...defaultSearchParams,
  ...customization.defaultSearchParams,
};

export const searchParamsSlice = createSlice({
  name: "searchParams",
  initialState: defaultSearchParamsState,
  reducers: {
    updateSearchParams: (state, action) => {
      const searchParams = action.payload;
      cookies.set(customization.searchParamsCookie, searchParams, {
        path: "/",
        maxAge: "100000000",
      });
      return { ...searchParams };
    },
  },
});

export const { updateSearchParams } = searchParamsSlice.actions;

export const useSearchParams = () => useSelector((state) => state.searchParams);

export default searchParamsSlice.reducer;
