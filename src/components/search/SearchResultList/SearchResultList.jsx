import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Stack, styled } from "@mui/material";
import { SearchResultSingleItem } from "./SearchResultSingleItem";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import { incrementPageSize } from "src/features/searchPageParamsReducer";

export const SearchResultList = styled(
  ({ logs, dateDescending, isFetchingSearchResults, className }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchResultListRef = useRef(null);
    const loadMoreLogsRef = useRef(null);

    const { id: paramLogId } = useParams();
    const currentLogEntryId = Number(paramLogId);

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
      navigate(`/logs/${logId}`);
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        const nextSibling = e?.target?.nextElementSibling;
        if (nextSibling) {
          const logId = nextSibling.getAttribute("data-id");
          navigateToEntry(logId);
          nextSibling.focus();
        }
      }

      if (e.key === "ArrowUp") {
        const prevSibling = e?.target?.previousElementSibling;
        if (prevSibling) {
          const logId = prevSibling.getAttribute("data-id");
          navigateToEntry(logId);
          prevSibling.focus();
        }
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
        {logsWithTrimmedGroupIds?.map((log) => {
          if (log.groupId) {
            return (
              <SearchResultGroupItem
                key={log.id}
                log={log}
                dateDescending={dateDescending}
                onClick={navigateToEntry}
                handleKeyDown={handleKeyDown}
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
