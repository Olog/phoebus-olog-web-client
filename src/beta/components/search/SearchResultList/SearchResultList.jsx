import { useEffect, useMemo } from "react";
import { Stack, styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { SearchResultSingleItem } from "./SearchResultSingleItem";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import {
  updateCurrentLogEntry,
  useCurrentLogEntry
} from "features/currentLogEntryReducer";
import useBetaNavigate from "hooks/useBetaNavigate";

export const SearchResultList = styled(
  ({ logs, dateDescending, className }) => {
    const dispatch = useDispatch();
    const navigate = useBetaNavigate();
    const { id: logId } = useParams();

    const currentLogEntry = useCurrentLogEntry();
    const currentLogEntryId = Number(currentLogEntry?.id);

    const nestLogReplies = (array) => {
      const groups = {};

      array.forEach((item) => {
        if (item.groupId) {
          if (!groups[item.groupId]) {
            groups[item.groupId] = [];
          }
          groups[item.groupId].push(item);
        }
      });

      const result = [];
      Object.keys(groups).forEach((groupId) => {
        const group = groups[groupId];
        const parent = group.sort((prev, curr) =>
          prev.createdDate < curr.createdDate ? -1 : 1
        )[0];
        const replies = group
          .filter((item) => item !== parent)
          .toSorted(sortByCreatedDate(true));

        result.push({ ...parent, replies });
      });

      array.forEach((item) => {
        if (!item.groupId) {
          result.push(item);
        }
      });

      return result;
    };

    const logsWithGroupIds = useMemo(
      () =>
        logs.map((log) => ({
          ...log,
          groupId: getLogEntryGroupId(log.properties)
        })),
      [logs]
    );

    const logsWithNestedReplies = useMemo(
      () =>
        nestLogReplies(logsWithGroupIds).toSorted(
          sortByCreatedDate(dateDescending)
        ),
      [logsWithGroupIds, dateDescending]
    );

    const navigateToEntry = (log) => {
      dispatch(updateCurrentLogEntry(log));
      navigate(`/logs/${log.id}`);
    };

    useEffect(() => {
      const logByParamId = logs.find((log) => log.id === Number(logId));
      navigateToEntry(logByParamId ?? logsWithNestedReplies[0]);
      document
        .querySelector(`[data-id="${logsWithNestedReplies[0].id}"]`)
        .focus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        const nextSibling = e?.target?.nextElementSibling;
        if (nextSibling) {
          const logId = nextSibling.getAttribute("data-id");
          const log = logsWithGroupIds.find((log) => log.id === Number(logId));
          navigateToEntry(log);
          nextSibling.focus();
        }
      }

      if (e.key === "ArrowUp") {
        const prevSibling = e?.target?.previousElementSibling;
        if (prevSibling) {
          const logId = prevSibling.getAttribute("data-id");
          const log = logsWithGroupIds.find((log) => log.id === Number(logId));
          navigateToEntry(log);
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
        {logsWithNestedReplies?.map((log) => {
          if (log.replies) {
            return (
              <SearchResultGroupItem
                key={log.id}
                log={log}
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
