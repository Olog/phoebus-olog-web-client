import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { defaultSearchParamsState } from "features/searchParamsReducer";
import {
  defaultSearchPageParamsState,
  updateSearchPageParams
} from "features/searchPageParamsReducer";
import customization from "config/customization";
import { ologApi } from "api/ologApi";
import { updateAdvancedSearch } from "src/features/advancedSearchThunk";

const cookies = new Cookies();

const Initialize = ({ children }) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  // attempt to fetch current user if logged in
  ologApi.endpoints.getUser.useQuery({
    pollingInterval: customization.defaultSearchFrequency
  });

  // Initialize search params state
  useEffect(() => {
    if (!ready) {
      const initialSearchPageParams =
        cookies.get(customization.searchPageParamsCookie) ??
        defaultSearchPageParamsState;
      dispatch(updateSearchPageParams(initialSearchPageParams));

      const initialSearchParams =
        cookies.get(customization.searchParamsCookie) ??
        defaultSearchParamsState;
      dispatch(updateAdvancedSearch(initialSearchParams));

      setReady(true);
    }
  }, [dispatch, ready]);

  if (ready) {
    return <>{children}</>;
  }

  return <LinearProgress />;
};

export default Initialize;
