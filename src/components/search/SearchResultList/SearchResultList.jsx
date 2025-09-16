import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Stack, styled } from "@mui/material";
import { SearchResultSingleItem } from "./SearchResultSingleItem";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import {
  incrementPageSize,
  useSearchPageParams
} from "src/features/searchPageParamsReducer";

export const SearchResultList = styled(
  ({ logs, isFetchingSearchResults, className }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const groupedRepliesActive = useSelector(
      (state) => state.advancedSearch.groupedReplies
    );
    const dateDescending = useSearchPageParams().sort === "down";
    const searchResultListRef = useRef(null);
    const loadMoreLogsRef = useRef(null);

    const { id: paramLogId } = useParams();
    const currentLogEntryId = Number(paramLogId);

    const [idToToggleExpand, setIdToToggleExpand] = useState(null);

    const removeSubsequentReplies = (logs) => {
      const visitedGroups = [];
      return logs.reduce((res, log) => {
        if (log.groupId && visitedGroups.includes(log.groupId)) {
          return [...res];
        } else {
          visitedGroups.push(log.groupId);
          return [...res, log];
        }
      }, []);
    };

    const logsWithGroupIds = useMemo(
      () =>
        logs.map((log) => ({
          ...log,
          groupId: getLogEntryGroupId(log.properties)
        })),
      [logs]
    );

    const logsWithTrimmedGroupIds = useMemo(
      () =>
        removeSubsequentReplies(
          logsWithGroupIds.toSorted(sortByCreatedDate(dateDescending))
        ),
      [logsWithGroupIds, dateDescending]
    );

    const navigateToEntry = (logId) => {
      navigate(`/logs/${logId}${location.search}`);
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        const nextSibling = e?.target?.nextElementSibling;
        const id = nextSibling?.id ?? "";

        if (id.includes("search-result-log")) {
          const logId = nextSibling.getAttribute("data-id");
          navigateToEntry(logId);
          nextSibling.focus();
        }
      }

      if (e.key === "ArrowUp") {
        const prevSibling = e?.target?.previousElementSibling;
        const id = prevSibling?.id ?? "";

        if (id.includes("search-result-log")) {
          const logId = prevSibling.getAttribute("data-id");
          navigateToEntry(logId);
          prevSibling.focus();
        }
      }

      if ((e.key === "ArrowRight") | (e.key === "ArrowLeft")) {
        setIdToToggleExpand(currentLogEntryId);
      }
    };

    useEffect(() => {
      // Infinite scrolling with IntersectionObserver
      if (searchResultListRef.current && loadMoreLogsRef.current) {
        const target = loadMoreLogsRef.current;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                dispatch(incrementPageSize());
              }
            });
          },
          {
            root: searchResultListRef.current,
            rootMargin: "800px",
            threshold: 0
          }
        );

        observer.observe(target);
        return () => {
          observer.unobserve(target);
        };
      }
    }, [searchResultListRef, loadMoreLogsRef, dispatch]);

    return (
      <Stack
        ref={searchResultListRef}
        flex={2}
        px={0}
        overflow="auto"
        id="searchResultList"
        className={`SearchResultList ${className}`}
      >
        {groupedRepliesActive
          ? logsWithTrimmedGroupIds?.map((log) => {
              if (log.groupId) {
                return (
                  <SearchResultGroupItem
                    key={log.id}
                    log={log}
                    dateDescending={dateDescending}
                    onClick={navigateToEntry}
                    handleKeyDown={handleKeyDown}
                    shouldParentToggleExpand={idToToggleExpand === log.id}
                    onToggleComplete={() => setIdToToggleExpand(null)}
                  />
                );
              } else {
                return (
                  <SearchResultSingleItem
                    key={log.id}
                    log={log}
                    selected={`${currentLogEntryId}` === `${log.id}`}
                    onClick={navigateToEntry}
                    handleKeyDown={handleKeyDown}
                  />
                );
              }
            })
          : logsWithGroupIds.map((log) => {
              return (
                <SearchResultSingleItem
                  key={log.id}
                  log={log}
                  selected={`${currentLogEntryId}` === `${log.id}`}
                  onClick={navigateToEntry}
                  handleKeyDown={handleKeyDown}
                  isReply={!!log.groupId}
                />
              );
            })}
        <Box ref={loadMoreLogsRef}>
          {isFetchingSearchResults && (
            <Box
              display="flex"
              justifyContent="center"
              py={1.25}
            >
              <CircularProgress
                size="1.5rem"
                sx={{ color: "#757575" }}
              />
            </Box>
          )}
        </Box>
      </Stack>
    );
  }
)({});
