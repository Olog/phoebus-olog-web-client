import { Alert, Divider, IconButton, LinearProgress, Stack, Typography, styled } from "@mui/material";
import { ologApi, removeEmptyKeys } from "api/ologApi";
import { sortByCreatedDate } from "components/log/sort";
import { moment } from "lib/moment";
import React, { useCallback, useMemo, useState } from "react";
import SearchResultItemRow from "./SearchResultItemRow";
import SearchResultDateRow from "./SearchResultDateRow";
import customization from "config/customization";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { updateCurrentLogEntry, useCurrentLogEntry } from "features/currentLogEntryReducer";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { updateSearchPageParams, useSearchPageParams } from "features/searchPageParamsReducer";
import SimpleSearch from "../SimpleSearch";

const NoRowsOverlay = (props) => {
    return (
      <Stack sx={{ padding: 1 }} alignItems="center">
        <Typography
          {...props}
          variant="body1"
        >
          No records found
        </Typography>
      </Stack>
    );
};
  
const LoadingOverlay = (props) => {
    return (
      <LinearProgress
        sx={{ marginY: 2, top: -9 }}
        {...props}
      />
    );
};

const SearchResultList = styled(({className}) => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentLogEntry = useCurrentLogEntry();
    const searchParams = useSearchParams();
    const searchPageParams = useSearchPageParams();
    const pageSizeOptions = customization.defaultRowsPerPageOptions;
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(
        pageSizeOptions.includes(searchPageParams?.size) 
        ? searchPageParams?.size 
        : customization.defaultPageSize
    );
    const paginationModel = useMemo(() => ({
        page,
        pageSize
    }), [page, pageSize]);

    const {         
        data: searchResults={
            logs: [],
            hitCount: 0
        },
        error, 
        isFetching: loading 
    } = ologApi.endpoints.searchLogs.useQuery({
            searchParams: {...removeEmptyKeys({...searchParams})}, 
            searchPageParams: { 
                ...searchPageParams, 
                sort: searchPageParams.dateDescending ? "down" : "up"
            }
        }, {
        pollingInterval: customization.defaultSearchFrequency,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true
    });

    if(error) {
        console.error("Search error", error);
    }

    // generate unique ymds, using the smaller/larger date to match sort order
    const uniqueDates = [...new Set(searchResults?.logs?.map(log => !searchPageParams.dateDescending 
        ? moment(log.createdDate).hours(0).minutes(0).seconds(0).milliseconds(0).valueOf()
        : moment(log.createdDate).hours(23).minutes(59).seconds(59).milliseconds(999).valueOf()
    ))];

    // sort by the date
    const rows = [
        ...searchResults?.logs,
        ...uniqueDates.map(date => ({ id: `daterow-${date}`, createdDate: date, isDateRow: true}))
    ]?.toSorted(sortByCreatedDate(searchPageParams.dateDescending));

    const columns = [
        {
            field: "log",
            flex: 1,
            renderCell: (params) => params.row?.isDateRow 
                ? <SearchResultDateRow createdDate={params.row?.createdDate} />
                : <SearchResultItemRow log={params.row} selected={params?.row?.id === currentLogEntry?.id} />
        }
    ]

    const onRowClick = (params) => {
        if(params.row.isDateRow) {
            return;
        }
        const log = params.row;
        dispatch(updateCurrentLogEntry(log));
        navigate(`/beta/logs/${log.id}`);
    }

    const toggleSort = () => {
        dispatch(updateSearchPageParams({...searchPageParams, dateDescending: !searchPageParams.dateDescending }))
    }

    const onPaginationModelChange = useCallback((model) => {
        dispatch(updateSearchPageParams({
            ...searchPageParams, 
            from: model.page*searchPageParams?.size ?? 0, 
            size: model.pageSize
        }));
        setPageSize(model.pageSize);
        setPage(model.page);
    }, [dispatch, searchPageParams]);

    return (
        <Stack 
            className={`SearchResultList ${className}`} 
            minHeight={0} 
            height="100%" 
            divider={<Divider flexItem />} 
            gap={1}
        >
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                <SimpleSearch />
                <IconButton onClick={toggleSort}>
                    { searchPageParams.dateDescending 
                        ? <ArrowDownwardIcon titleAccess="sort, date descending" /> 
                        : <ArrowUpwardIcon titleAccess="sort, date ascending" />
                    }
                </IconButton>
            </Stack>
            {error 
                ? <Alert color="error">
                    {error?.status === "FETCH_ERROR" 
                        ? "Error: Log Service Unavailable"
                        : `Error ${error?.code}: ${error?.message}`
                    }
                </Alert>  
                : <DataGrid 
                    aria-label="Search Results"
                    columns={columns}
                    rows={rows}
                    paginationMode="server"
                    pagination={true}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onPaginationModelChange}
                    rowCount={searchResults?.hitCount}
                    pageSizeOptions={pageSizeOptions}
                    getRowHeight={({model}) => {
                        if (model?.isDateRow) {
                            return 25;
                        } 
                        return null;
                    }}
                    slots={{
                        noRowsOverlay: NoRowsOverlay,
                        noResultsOverlay: NoRowsOverlay,
                        loadingOverlay: LoadingOverlay
                    }}
                    slotProps={{
                        pagination: {
                        showFirstButton: true,
                        showLastButton: true,
                        variant: "outlined",
                        shape: "rounded",
                        labelRowsPerPage: "Hits Per Page"
                        }
                    }}
                    loading={loading}
                    rowHeight={110}
                    onRowClick={onRowClick}
                    rowSelectionModel={currentLogEntry ? [currentLogEntry.id] : []}
                    getRowClassName={(params) => params.row?.isDateRow ? "date-row" : "log-row"}
                    sx={{
                        // Disable the "X rows selected" text
                        "& .MuiDataGrid-selectedRowCount": {
                            display: "none"
                        },

                        // No borders
                        border: "none",
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none"
                        },

                        // align the footer / pagination elements
                        "& .MuiDataGrid-footerContainer": {
                            justifyContent: "flex-end"
                        },

                        // Hide the header row
                        "& .MuiDataGrid-columnHeaders": { 
                            display: "none" 
                        },

                        // Hide the cell focus outline
                        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                            outline: "none",
                        },

                    }}
                />
            }
        </Stack>
    )
})({})

export default SearchResultList;