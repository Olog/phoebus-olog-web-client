import {
  Alert,
  Box,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  styled
} from "@mui/material";
import { useMemo } from "react";
import { SearchResultList } from "./SearchResultList";
import { SearchParamsBadges } from "./SearchParamsBadges";
import { ologApi, removeEmptyKeys } from "api/ologApi";
import customization from "config/customization";
import { useSearchPageParams } from "features/searchPageParamsReducer";
import { useSearchParams } from "features/searchParamsReducer";
import { useAdvancedSearch } from "features/advancedSearchReducer";
import { withCacheBust } from "hooks/useSanitizedSearchParams";

export const SearchResults = styled(({ className }) => {
  const { active: advancedSearchActive } = useAdvancedSearch();
  const searchParams = useSearchParams();
  const searchPageParams = useSearchPageParams();

  const searchLogsQuery = useMemo(() => {
    let params = {
      ...searchPageParams,
      sort: searchPageParams.dateDescending ? "down" : "up"
    };

    if (advancedSearchActive) {
      params = {
        ...params,
        ...searchParams
      };
      if (params.tags) {
        params.tags = params.tags.map((it) => it.name);
      }
      if (params.logbooks) {
        params.logbooks = params.logbooks.map((it) => it.name);
      }
      if (params.query) {
        delete params.query;
      }
    } else {
      params = {
        ...params,
        query: searchParams.query,
        start: searchParams.start
      };
    }

    return withCacheBust(removeEmptyKeys(params));
  }, [searchPageParams, searchParams, advancedSearchActive]);

  const {
    data: searchResults = {
      logs: [],
      hitCount: 0
    },
    error,
    isLoading: loading,
    isFetching: isFetchingSearchResults
  } = ologApi.endpoints.searchLogs.useQuery(searchLogsQuery, {
    pollingInterval: customization.defaultSearchFrequency,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });

  return (
    <Stack
      className={`SearchResultList ${className}`}
      position="relative"
      sx={{ backgroundColor: "#fafafa", minHeight: 0 }}
    >
      {advancedSearchActive && (
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
      {loading && <LinearProgress />}
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
          dateDescending={searchPageParams?.dateDescending}
          isFetchingSearchResults={isFetchingSearchResults}
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
