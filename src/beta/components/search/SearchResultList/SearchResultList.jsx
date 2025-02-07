import { useEffect, useMemo } from "react";
import { Stack, styled } from "@mui/material";
import { useParams } from "react-router-dom";
import { SearchResultSingleItem } from "./SearchResultSingleItem";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import useBetaNavigate from "hooks/useBetaNavigate";

export const SearchResultList = styled(
  ({ logs, dateDescending, className }) => {
    const navigate = useBetaNavigate();

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

    useEffect(() => {
      if (!currentLogEntryId) {
        const firstLogEntry = document.querySelector("[data-id]");
        navigateToEntry(firstLogEntry.getAttribute("data-id"));
        firstLogEntry.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
      <Stack
        flex={2}
        px={0}
        overflow="scroll"
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
      </Stack>
    );
  }
)({});
