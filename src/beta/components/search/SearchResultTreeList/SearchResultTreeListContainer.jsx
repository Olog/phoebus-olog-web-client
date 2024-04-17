import { Alert, Box, LinearProgress, Stack, TablePagination, Typography, styled } from "@mui/material";
import { ologApi, removeEmptyKeys } from "api/ologApi";
import { getLogEntryGroupId } from "components/Properties";
import customization from "config/customization";
import { updateCurrentLogEntry, useCurrentLogEntry } from "features/currentLogEntryReducer";
import { updateSearchPageParams, useSearchPageParams } from "features/searchPageParamsReducer";
import { useSearchParams } from "features/searchParamsReducer";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { SearchResultSingleItem } from "./SearchResultSingleItem";

export const SearchResultTreeListContainer = styled(({className}) => {

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

  const onClick = (log) => {
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
      size: pageSize
    }));
  }, [dispatch, page, pageSize])

  const remaining = searchPageParams.from + Math.min(pageSize, searchResults.logs.length);

  return (
    <Stack
      minWidth={350}
      className={`SearchResultList ${className}`} 
    >
      <Stack>
        <Typography>Search Results</Typography>
        <Typography>{searchPageParams.from + 1}-{remaining} of {count}</Typography>
      </Stack>
      <Stack>
        {loading ? <LinearProgress /> : null}
        {error ? 
          <Alert color="error">
            {error?.status === "FETCH_ERROR" 
                ? "Error: Log Service Unavailable"
                : `Error ${error?.code}: ${error?.message}`
            }
          </Alert> : null
        }
        <Box padding={1}>
          {searchResults.logs?.map(log => {
            const isGroupEntry = getLogEntryGroupId(log.properties);
            if(isGroupEntry) {
              return <SearchResultGroupItem log={log} onClick={onClick} dateDescending={searchPageParams.dateDescending} />
            } else {
              return <SearchResultSingleItem log={log} />
            }
          })}
        </Box>
      </Stack>
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