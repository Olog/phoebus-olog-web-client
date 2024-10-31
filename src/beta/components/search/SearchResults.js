import { Alert, Badge, Box, IconButton, LinearProgress, Stack, TablePagination, Typography, styled } from "@mui/material";
import { ologApi, removeEmptyKeys } from "api/ologApi";
import customization from "config/customization";
import { updateCurrentLogEntry, useCurrentLogEntry } from "features/currentLogEntryReducer";
import { updateSearchPageParams, useSearchPageParams } from "features/searchPageParamsReducer";
import { updateSearchParams, useSearchParams } from "features/searchParamsReducer";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import SearchResultList from "./SearchResultList";
import SimpleSearch from "./SimpleSearch";
import { SortToggleButton } from "./SortToggleButton";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { SearchParamsBadges } from "./SearchParamsBadges";
import { AdvancedSearchDrawer } from "./SearchResultList/AdvancedSearchDrawer";
import { useAdvancedSearch } from "features/advancedSearchReducer";
import { withCacheBust } from "hooks/useSanitizedSearchParams";
import useBetaNavigate from "hooks/useBetaNavigate";

export const SearchResults = styled(({ className }) => {

  const dispatch = useDispatch();
  const navigate = useBetaNavigate();

  const { active: advancedSearchActive, fieldCount: advancedSearchFieldCount } = useAdvancedSearch();
  const currentLogEntry = useCurrentLogEntry();
  const searchParams = useSearchParams();
  const searchPageParams = useSearchPageParams();
  const rowsPerPageOptions = customization.defaultRowsPerPageOptions;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(
    rowsPerPageOptions.includes(searchPageParams?.size)
      ? searchPageParams?.size
      : customization.defaultPageSize
  );
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

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
        params.tags = params.tags.map(it => it.name);
      }
      if (params.logbooks) {
        params.logbooks = params.logbooks.map(it => it.name);
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
    isLoading: loading
  } = ologApi.endpoints.searchLogs.useQuery(
    searchLogsQuery,
    {
      pollingInterval: customization.defaultSearchFrequency,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true
    }
  );

  const count = searchResults?.hitCount ?? 0;

  const onRowClick = (log) => {
    dispatch(updateCurrentLogEntry(log));
    navigate(`/logs/${log.id}`);
  }

  const onPageChange = (event, page) => {
    setPage(page);
  };

  const onRowsPerPageChange = (event) => {
    setPageSize(event.target.value)
  }

  useEffect(() => {
    dispatch(updateSearchPageParams({
      from: page * pageSize,
      size: pageSize,
      dateDescending: searchPageParams?.dateDescending
    }));
  }, [dispatch, page, pageSize, searchPageParams.dateDescending])

  const remaining = searchPageParams.from + Math.min(pageSize, searchResults.logs.length);

  const toggleSort = () => {
    dispatch(updateSearchPageParams({ ...searchPageParams, dateDescending: !searchPageParams.dateDescending }));
  }

  return (
    <Stack
      minWidth={400}
      className={`SearchResultList ${className}`}
      padding={1}
      gap={1}
      pt={2}
      position="relative"
    >
      <AdvancedSearchDrawer searchParams={searchParams} advancedSearchOpen={advancedSearchOpen} setAdvancedSearchOpen={setAdvancedSearchOpen} />
      <Box>
        {advancedSearchActive ? null : <SimpleSearch />}
        <SearchParamsBadges search={searchParams} onSearch={vals => dispatch(updateSearchParams(vals))} />
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Stack flexDirection="row" alignItems="center" gap={0.5}>
            <Typography component="h2" variant="h6" fontWeight="bold" >Results</Typography>
            {searchResults.hitCount > 0 ?
              <Typography variant="body2" fontStyle="italic" height="100%" position="relative" top={2}>{searchPageParams.from + 1}-{remaining} of {count}</Typography>
              : null
            }
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            <IconButton onClick={() => setAdvancedSearchOpen(true)}>
              <Badge badgeContent={advancedSearchActive ? advancedSearchFieldCount : 0} color="primary">
                <FilterAltIcon />
              </Badge>
            </IconButton>
            <SortToggleButton label="create date" isDescending={searchPageParams?.dateDescending} onClick={toggleSort} />
          </Stack>
        </Stack>
      </Box>
      {loading && <LinearProgress />}
      {error ?
        <Box>
          <Alert severity="error">
            {error?.status === "FETCH_ERROR"
              ? "Error: Log Service Unavailable"
              : `Error ${error?.code}: ${error?.message}`
            }
          </Alert>
        </Box> : null
      }
      {searchResults?.logs?.length > 0
        ? <SearchResultList
          logs={searchResults.logs}
          dateDescending={searchPageParams?.dateDescending}
          selectedId={currentLogEntry?.id}
          onRowClick={onRowClick}
        />
        : <Box >
          <Typography>No records found</Typography>
        </Box>
      }
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
      />
    </Stack>
  );

})({});