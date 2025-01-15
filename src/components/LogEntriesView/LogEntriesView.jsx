/**
 * Copyright (C) 2020 European Spallation Source ERIC.
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

import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Typography, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { LogDetails } from "components/LogDetails";
import SearchResultList from "components/SearchResult/SearchResultList";
import customization from "config/customization";
import {
  updateSearchPageParams,
  useSearchPageParams
} from "features/searchPageParamsReducer";
import { ologApi, removeEmptyKeys } from "api/ologApi";
import {
  updateCurrentLogEntry,
  useCurrentLogEntry
} from "features/currentLogEntryReducer";
import { ServiceErrorBanner } from "components/ErrorBanner";
import { Filters } from "components/Filters";
import { useSearchParams } from "features/searchParamsReducer";
import { withCacheBust } from "hooks/useSanitizedSearchParams";

const ContentContainer = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "row",
  gap: 10,
  padding: 1,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    overflow: "auto",
    height: "auto"
  }
}));

const StyledFilters = styled(Filters)(({ theme }) => ({
  flex: "0 0 20%",
  border: `1px solid ${grey[300]}`,
  borderRadius: "5px",
  [theme.breakpoints.down("sm")]: {
    order: 9,
    width: "100%"
  }
}));

const StyledSearchResultList = styled(SearchResultList)(({ theme }) => ({
  flex: "0 0 40%",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "5px",
  [theme.breakpoints.down("sm")]: {
    order: 9,
    width: "100%"
  }
}));

const LogDetailsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: "1 0 0",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "5px",

  [theme.breakpoints.up("sm")]: {
    overflowX: "hidden",
    overflowY: "auto"
  },

  [theme.breakpoints.down("sm")]: {
    order: -1,
    width: "100%"
  }
}));

const LogEntriesView = () => {
  const currentLogEntry = useCurrentLogEntry();

  const [showFilters, setShowFilters] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [logGroupRecords, setLogGroupRecords] = useState([]);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchPageParams = useSearchPageParams();
  const searchLogsQuery = useMemo(() => {
    let params = {
      ...searchPageParams,
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

    return withCacheBust(removeEmptyKeys(params));
  }, [searchParams, searchPageParams]);

  const {
    data: searchResults = {
      logs: [],
      hitCount: 0
    },
    error: searchResultError,
    isFetching: searchInProgress
  } = ologApi.endpoints.searchLogs.useQuery(searchLogsQuery, {
    pollingInterval: customization.defaultSearchFrequency,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });
  if (searchResultError) {
    console.error(
      "An error occurred while fetching search results",
      searchResultError
    );
  }
  const [getLog, { data: getLogResult, error: getLogError }] =
    ologApi.endpoints.getLog.useLazyQuery();
  const { id: logId } = useParams();

  // On changes to search params, reset the page to zero
  useEffect(() => {
    dispatch(updateSearchPageParams({ ...searchPageParams, from: 0 }));
    // Ignore warning about missing dependency; we do *not* want
    // to update searchPageParams when searchPageParams changes...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // If viewing a specific log entry, then retrieve it
  // Otherwise clear the current entry
  useEffect(() => {
    if (logId > 0) {
      const result = getLog({ id: logId });
      return () => {
        result.abort();
      };
    } else {
      dispatch(updateCurrentLogEntry(null));
    }
  }, [dispatch, getLog, logId]);

  // When the log entry is received, update the current entry to it
  // Otherwise clear the current entry
  useEffect(() => {
    if (getLogResult) {
      dispatch(updateCurrentLogEntry(getLogResult));
    }

    if (getLogError) {
      dispatch(updateCurrentLogEntry(null));
    }
  }, [getLogResult, getLogError, dispatch]);

  useEffect(() => {
    setShowGroup(false);
  }, [currentLogEntry]);

  const renderedLogEntryDetails = (() => {
    if (currentLogEntry) {
      return (
        <LogDetails
          {...{
            showGroup,
            setShowGroup,
            currentLogEntry,
            logGroupRecords,
            setLogGroupRecords,
            searchResults
          }}
        />
      );
    } else {
      if (logId) {
        return (
          <Typography variant="h5">Log record id {logId} not found</Typography>
        );
      } else {
        return (
          <Typography variant="h5">
            Search for log entries, and select one to view
          </Typography>
        );
      }
    }
  })();

  return (
    <>
      {searchResultError ? (
        <ServiceErrorBanner
          title="Search Error"
          serviceName="logbook"
          error={searchResultError}
        />
      ) : null}
      <ContentContainer id="log-entries-view-content">
        <StyledFilters
          {...{
            showFilters
          }}
        />
        <StyledSearchResultList
          {...{
            searchParams,
            searchPageParams,
            searchResults,
            searchInProgress,
            currentLogEntry,
            showFilters,
            setShowFilters
          }}
        />
        <LogDetailsContainer id="logdetails-container">
          {renderedLogEntryDetails}
        </LogDetailsContainer>
      </ContentContainer>
    </>
  );
};

export default LogEntriesView;
