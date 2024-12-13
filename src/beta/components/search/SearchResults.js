import {
  Alert,
  Box,
  Divider,
  LinearProgress,
  Stack,
  TablePagination,
  Typography,
  styled,
} from "@mui/material";
import { ologApi, removeEmptyKeys } from "api/ologApi";
import customization from "config/customization";
import {
  updateSearchPageParams,
  useSearchPageParams,
} from "features/searchPageParamsReducer";
import { useSearchParams } from "features/searchParamsReducer";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import SearchResultList from "./SearchResultList";
import { SearchParamsBadges } from "./SearchParamsBadges";
import { useAdvancedSearch } from "features/advancedSearchReducer";
import { withCacheBust } from "hooks/useSanitizedSearchParams";

export const SearchResults = styled(({ className }) => {
  const dispatch = useDispatch();

  const { active: advancedSearchActive } = useAdvancedSearch();
  const searchParams = useSearchParams();
  const searchPageParams = useSearchPageParams();
  const rowsPerPageOptions = customization.defaultRowsPerPageOptions;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(
    rowsPerPageOptions.includes(searchPageParams?.size)
      ? searchPageParams?.size
      : customization.defaultPageSize
  );

  const searchLogsQuery = useMemo(() => {
    let params = {
      ...searchPageParams,
      sort: searchPageParams.dateDescending ? "down" : "up",
    };

    if (advancedSearchActive) {
      params = {
        ...params,
        ...searchParams,
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
        start: searchParams.start,
      };
    }

    return withCacheBust(removeEmptyKeys(params));
  }, [searchPageParams, searchParams, advancedSearchActive]);

  const {
    data: searchResults = {
      logs: [],
      hitCount: 0,
    },
    error,
    isLoading: loading,
  } = ologApi.endpoints.searchLogs.useQuery(searchLogsQuery, {
    pollingInterval: customization.defaultSearchFrequency,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const count = searchResults?.hitCount ?? 0;

  const onPageChange = (event, page) => {
    setPage(page);
  };

  const onRowsPerPageChange = (event) => {
    setPageSize(event.target.value);
  };

  useEffect(() => {
    dispatch(
      updateSearchPageParams({
        from: page * pageSize,
        size: pageSize,
        dateDescending: searchPageParams?.dateDescending,
      })
    );
  }, [dispatch, page, pageSize, searchPageParams.dateDescending]);

  return (
    <Stack
      justifyContent="space-between"
      className={`SearchResultList ${className}`}
      position="relative"
      sx={{ backgroundColor: "#fafafa", minWidth: "400px" }}
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
      {error ? (
        <Box>
          <Alert severity="error">
            {error?.status === "FETCH_ERROR"
              ? "Error: Log Service Unavailable"
              : `Error ${error?.code}: ${error?.message}`}
          </Alert>
        </Box>
      ) : null}
      {searchResults?.logs?.length > 0 ? (
        <SearchResultList
          logs={searchResults.logs}
          dateDescending={searchPageParams?.dateDescending}
        />
      ) : (
        <Box flex={1} py={2} px={4}>
          <Typography>No records found</Typography>
        </Box>
      )}
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        rowsPerPage={pageSize}
        onRowsPerPageChange={onRowsPerPageChange}
        variant={"outlined"}
        shape={"rounded"}
        labelRowsPerPage={"Hits Per Page"}
        labelDisplayedRows={() => null}
        showFirstButton
        showLastButton
        sx={{
          borderTop: "1px solid #bdbdbd",
          height: "auto",
          "&:last-child": {
            paddingRight: "20px",
          },
        }}
      />
    </Stack>
  );
})({});
