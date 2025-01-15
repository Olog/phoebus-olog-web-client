/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import { Divider, LinearProgress, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import SearchBox from "./SearchBox";
import SearchResultItem from "./SearchResultItem";
import { updateCurrentLogEntry } from "features/currentLogEntryReducer";
import customization from "config/customization";
import { updateSearchPageParams } from "features/searchPageParamsReducer";
import { sortByCreatedDate } from "components/log/sort";

const NoRowsOverlay = (props) => {
  return (
    <Stack
      sx={{ padding: 1 }}
      alignItems="center"
    >
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

/**
 * Pane showing search query input and a the list of log entries
 * matching the query.
 */
const SearchResultList = ({
  searchParams,
  searchPageParams,
  searchResults,
  searchInProgress,
  currentLogEntry,
  showFilters,
  setShowFilters,
  className
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageSizeOptions = customization.defaultRowsPerPageOptions;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(
    pageSizeOptions.includes(searchPageParams?.size)
      ? searchPageParams?.size
      : customization.defaultPageSize
  );

  // Guarantee that sort is applied for the current page of results
  const sortedResults = {
    ...searchResults,
    logs: searchResults?.logs?.toSorted(
      sortByCreatedDate(searchPageParams.sort === "down")
    )
  };

  const columns = [
    {
      field: "renderedLog",
      renderCell: (params) => <>{params.value}</>,
      flex: 1
    }
  ];

  const rows = sortedResults.logs.map((it) => ({
    id: it.id,
    log: it,
    renderedLog: <SearchResultItem log={it} />
  }));

  const handleClick = (params) => {
    const log = params.row.log;
    dispatch(updateCurrentLogEntry(log));
    navigate(`/logs/${log.id}`);
  };
  const paginationModel = useMemo(
    () => ({
      page,
      pageSize
    }),
    [page, pageSize]
  );

  const onPaginationModelChange = useCallback(
    (model) => {
      dispatch(
        updateSearchPageParams({
          ...searchPageParams,
          from: model.page * searchPageParams?.size || 0,
          size: model.pageSize
        })
      );
      setPageSize(model.pageSize);
      setPage(model.page);
    },
    [dispatch, searchPageParams]
  );

  return (
    <Stack className={className}>
      <SearchBox {...{ searchParams, showFilters, setShowFilters }} />
      <Divider />
      <DataGrid
        aria-label="Search Results"
        columns={columns}
        rows={rows}
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
        loading={searchInProgress}
        rowHeight={70}
        onRowClick={handleClick}
        paginationMode="server"
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={searchResults?.hitCount}
        pageSizeOptions={pageSizeOptions}
        rowSelectionModel={currentLogEntry ? [currentLogEntry.id] : []}
        sx={{
          // Disable the "X rows selected" text
          "& .MuiDataGrid-selectedRowCount": {
            display: "none"
          },

          // No border
          border: 0,

          // align the footer / pagination elements
          "& .MuiDataGrid-footerContainer": {
            justifyContent: "flex-end"
          },

          // Hide the header row
          "& .MuiDataGrid-columnHeaders": {
            display: "none"
          }
        }}
      />
    </Stack>
  );
};

export default SearchResultList;
