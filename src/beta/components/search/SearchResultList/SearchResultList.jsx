import React, { useEffect, useMemo } from "react";
import { Stack, styled } from "@mui/material";
import { getLogEntryGroupId } from "components/Properties";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { SearchResultSingleItem } from "./SearchResultSingleItem";
import { sortByCreatedDate } from "components/log/sort";
import { updateCurrentLogEntry, useCurrentLogEntry } from "features/currentLogEntryReducer";
import { useDispatch } from "react-redux";
import useBetaNavigate from "hooks/useBetaNavigate";

export const SearchResultList = styled(({ logs, dateDescending, className }) => {
  const dispatch = useDispatch();
  const navigate = useBetaNavigate();

  const currentLogEntry = useCurrentLogEntry();
  const currentLogEntryId = Number(currentLogEntry?.id);

  const nestLogReplies = (array) => {
    const groups = {};

    array.forEach(item => {
      if (item.groupId) {
        if (!groups[item.groupId]) {
          groups[item.groupId] = [];
        }
        groups[item.groupId].push(item);
      }
    });

    const result = [];
    Object.keys(groups).forEach(groupId => {
      const group = groups[groupId];
      const parent = group.sort((prev, curr) => (prev.createdDate < curr.createdDate ? -1 : 1))[0];
      const replies = group.filter(item => item !== parent).toSorted(sortByCreatedDate(true));
      console.log({ group, parent })
      result.push({ ...parent, replies });
    });

    array.forEach(item => {
      if (!item.groupId) {
        result.push(item);
      }
    });

    return result;
  };

  const logsWithGroupIds = useMemo(() => logs.map((log, i) => ({
    ...log,
    groupId: getLogEntryGroupId(log.properties)
  })), [logs]);

  const logsWithNestedReplies = useMemo(() => nestLogReplies(logsWithGroupIds).toSorted(sortByCreatedDate(dateDescending), [logsWithGroupIds, dateDescending]));

  const navigateToEntry = (log) => {
    dispatch(updateCurrentLogEntry(log));
    navigate(`/logs/${log.id}`);
  }

  useEffect(() => {
    navigateToEntry(logsWithNestedReplies[0]);
    document.querySelector(`[data-id="${logsWithNestedReplies[0].id}"]`).focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      const nextSibling = e?.target?.nextElementSibling;
      if (nextSibling) {
        const logId = nextSibling.getAttribute("data-id");
        const log = logsWithGroupIds.find(log => log.id === Number(logId));
        navigateToEntry(log);
        nextSibling.focus();
      }
    }

    if (e.key === "ArrowUp") {
      const prevSibling = e?.target?.previousElementSibling;
      if (prevSibling) {
        const logId = prevSibling.getAttribute("data-id");
        const log = logsWithGroupIds.find(log => log.id === Number(logId));
        navigateToEntry(log);
        prevSibling.focus();
      }
    }
  }

  return (
    <Stack
      px={0}
      overflow="scroll"
      className={`SearchResultList ${className}`}
    >
      {logsWithNestedReplies?.map((log) => {
        if (log.replies) {
          return (
            <SearchResultGroupItem key={log.id} log={log} onClick={navigateToEntry} handleKeyDown={handleKeyDown} />
          )
        } else {
          return <SearchResultSingleItem key={log.id} log={log} selected={`${currentLogEntryId}` === `${log.id}`} onClick={navigateToEntry} handleKeyDown={handleKeyDown} />
        }
      })}
    </Stack>
  );

})({});