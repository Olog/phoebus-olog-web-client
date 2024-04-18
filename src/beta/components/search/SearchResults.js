import { Alert, Box, Divider, IconButton, LinearProgress, Stack, TablePagination, Typography, styled } from "@mui/material";
import { ologApi, removeEmptyKeys } from "api/ologApi";
import customization from "config/customization";
import { updateCurrentLogEntry, useCurrentLogEntry } from "features/currentLogEntryReducer";
import { updateSearchPageParams, useSearchPageParams } from "features/searchPageParamsReducer";
import { useSearchParams } from "features/searchParamsReducer";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchResultList from "./SearchResultList";
import SimpleSearch from "./SimpleSearch";
import { SortToggleButton } from "./SortToggleButton";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export const SearchResults = styled(({className}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const {         
      data: searchResults={
          logs: [],
          hitCount: 0
      },
      error, 
      isFetching: loading 
  } = ologApi.endpoints.searchLogs.useQuery(
    {
      searchParams: {...removeEmptyKeys({...searchParams})}, 
      searchPageParams: { 
          ...searchPageParams, 
          sort: searchPageParams.dateDescending ? "down" : "up"
      }
    }, 
    {
      pollingInterval: customization.defaultSearchFrequency,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true
    }
  );

  const count = searchResults?.hitCount ?? 0;

  const onRowClick = (log) => {
    dispatch(updateCurrentLogEntry(log));
    navigate(`/beta/logs/${log.id}`);
  }

  const onPageChange = (event, page) => {
    setPage(page);
  };

  const onRowsPerPageChange = (event) => {
    setPageSize(event.target.value)
  }

  useEffect(() => {
    dispatch(updateSearchPageParams({
      from: page*pageSize, 
      size: pageSize,
      dateDescending: searchPageParams?.dateDescending
    }));
  }, [dispatch, page, pageSize, searchPageParams.dateDescending])

  const remaining = searchPageParams.from + Math.min(pageSize, searchResults.logs.length);

  const toggleSort = () => {
    dispatch(updateSearchPageParams({...searchPageParams, dateDescending: !searchPageParams.dateDescending }));
  }

  return (
    <Stack
      minWidth={400}
      className={`SearchResultList ${className}`}
      padding={1}
      gap={1}
      divider={<Divider />}
      position="relative"
    >
      <Box>
        <SimpleSearch />
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Stack flexDirection="row" alignItems="center" gap={0.5}>
            <Typography component="h2" variant="h6" fontWeight="bold" >Search Results</Typography>
            {searchResults.hitCount > 0 ? 
              <Typography variant="body2" fontStyle="italic" height="100%" position="relative" top={2}>{searchPageParams.from + 1}-{remaining} of {count}</Typography>
              : null
            }
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <SortToggleButton label="create date" isDescending={searchPageParams?.dateDescending} onClick={toggleSort} />
          </Stack>
        </Stack>
      </Box>
      {loading ? <LinearProgress /> : null}
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
            <Typography>No Results</Typography>
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