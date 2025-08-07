import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import customization from "config/customization";

const cookies = new Cookies();

export const defaultSearchParams = {
  query: "",
  title: "",
  desc: "",
  properties: "",
  owner: "",
  level: [],
  start: "",
  end: "",
  logbooks: [],
  tags: [],
  attachments: "",
  groupedReplies: true,
  condensedEntries: false
};
export const defaultSearchParamsState = {
  ...defaultSearchParams,
  ...customization.defaultSearchParams
};

export const searchParamsSlice = createSlice({
  name: "searchParams",
  initialState: defaultSearchParamsState,
  reducers: {
    updateSearchParams: (state, action) => {
      const searchParams = action.payload;
      cookies.set(customization.searchParamsCookie, searchParams, {
        path: "/",
        maxAge: 100000000
      });
      return { ...searchParams };
    }
  }
});

export const { updateSearchParams } = searchParamsSlice.actions;

export const useSearchParams = () => useSelector((state) => state.searchParams);

export default searchParamsSlice.reducer;
