import {
  Alert,
  Box,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  styled
} from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { SearchResultList } from "./SearchResultList";
import { SearchParamsBadges } from "./SearchParamsBadges";
import { ologApi } from "api/ologApi";
import {
  resetPageSize,
  useSearchPageParams
} from "features/searchPageParamsReducer";
import { useEnhancedSearchParams } from "src/hooks/useEnhancedSearchParams";

export const SearchResults = styled(({ className }) => {
  const dispatch = useDispatch();
  const { searchParams } = useEnhancedSearchParams();

  const hasBadgeParams = Object.keys(searchParams).some(
    (key) => key !== "query"
  );
  const searchPageParams = useSearchPageParams();

  const searchLogsQuery = useMemo(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let params = {
      ...searchPageParams,
      ...searchParams,
      tz
    };

    return params;
  }, [searchPageParams, searchParams]);

  const {
    data: searchResults = {
      logs: [],
      hitCount: 0
    },
    error,
    isFetching: isFetchingSearchResults
  } = ologApi.endpoints.searchLogs.useQuery(searchLogsQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });

  const previousSearchParams = useRef(searchParams);
  useEffect(() => {
    if (previousSearchParams.current !== searchParams) {
      previousSearchParams.current = searchParams;
      dispatch(resetPageSize());
    }
  }, [dispatch, searchParams]);

  return (
    <Stack
      className={`SearchResultList ${className}`}
      position="relative"
      sx={{ backgroundColor: "#fafafa", minHeight: 0 }}
    >
      {hasBadgeParams && (
        <Box>
          <Box px={4}>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              pt={1}
            >
              <SearchParamsBadges />
            </Stack>
          </Box>
          <Divider sx={{ marginTop: 1, borderWidth: "1px" }} />
        </Box>
      )}
      {isFetchingSearchResults && (
        <LinearProgress sx={{ marginBottom: "-4px", zIndex: 1 }} />
      )}
      {error && (
        <Box>
          <Alert severity="error">
            {error?.status === "FETCH_ERROR"
              ? "Error: Log Service Unavailable"
              : `${error?.data?.error ?? "Error"}: ${error?.data?.message ?? "Unknown"}`}
          </Alert>
        </Box>
      )}
      {searchResults?.logs?.length > 0 ? (
        <SearchResultList
          logs={searchResults.logs}
          isFetchingSearchResults={isFetchingSearchResults}
          hasMoreLogs={
            !error && searchResults.logs.length < searchResults.hitCount
          }
        />
      ) : (
        <Box
          flex={1}
          py={2}
          px={4}
        >
          <Typography>No records found</Typography>
        </Box>
      )}
    </Stack>
  );
})({});
