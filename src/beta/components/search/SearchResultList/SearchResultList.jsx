import React, { useEffect } from "react";
import { Divider, Stack, styled } from "@mui/material";
import { getLogEntryGroupId } from "components/Properties";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { SearchResultSingleItem } from "./SearchResultSingleItem";
import { sortByCreatedDate } from "components/log/sort";
import { useKeyPress } from "hooks/useKeyPress";
import { updateCurrentLogEntry, useCurrentLogEntry } from "features/currentLogEntryReducer";
import { useDispatch } from "react-redux";
import useBetaNavigate from "hooks/useBetaNavigate";

export const SearchResultList = styled(({ logs, dateDescending, className }) => {
  const dispatch = useDispatch();
  const navigate = useBetaNavigate();

  const currentLogEntry = useCurrentLogEntry();
  const currentLogEntryId = Number(currentLogEntry?.id);
  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');

  const removeSubsequentReplies = (logs) => {
    const visitedGroups = []
    return logs.reduce((res, log) => {
      if (log.groupId && visitedGroups.includes(log.groupId)) {
        return [...res];
      } else {
        visitedGroups.push(log.groupId);
        return [...res, log];
      }
    }, []);
  }
  const logsAndReplies = logs.map(log => ({
    ...log,
    groupId: getLogEntryGroupId(log.properties)
  })).toSorted(sortByCreatedDate(dateDescending))

  const logsNoReplies = removeSubsequentReplies(
    logsAndReplies
  );

  const navigateToEntry = (log) => {
    dispatch(updateCurrentLogEntry(log));
    navigate(`/logs/${log.id}`);
  }

  const keyboardNavigate = (nextEntryId) => {
    const nextEntry = logsAndReplies.find(log => log.id === nextEntryId);
    if (nextEntry) {
      navigateToEntry(nextEntry);
    }
  }

  const setDefaultLogEntry = () => {
    if (!currentLogEntryId) {
      dispatch(updateCurrentLogEntry(logsNoReplies[0]));
    }
  }

  useEffect(() => {
    if (arrowUpPressed) {
      setDefaultLogEntry();
      keyboardNavigate(currentLogEntryId + 1);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      setDefaultLogEntry();
      keyboardNavigate(currentLogEntryId - 1);
    }
  }, [arrowDownPressed]);

  return (
    <Stack
      overflow="scroll"
      className={`SearchResultList ${className}`}
      divider={<Divider flexItem />}
    >
      {logsNoReplies?.map(log => {
        if (log.groupId) {
          return <SearchResultGroupItem key={log.id} log={log} selectedId={currentLogEntryId} onClick={navigateToEntry} dateDescending={dateDescending} />
        } else {
          return <SearchResultSingleItem key={log.id} log={log} selected={`${currentLogEntryId}` === `${log.id}`} onClick={navigateToEntry} />
        }
      })}
    </Stack>
  );

})({});