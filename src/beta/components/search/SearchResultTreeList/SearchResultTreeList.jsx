import React from "react";
import { Divider, Stack, styled } from "@mui/material";
import { getLogEntryGroupId } from "components/Properties";
import { SearchResultGroupItem } from "./SearchResultGroupItem/SearchResultGroupItem";
import { SearchResultSingleItem } from "./SearchResultSingleItem";
import { sortByCreatedDate } from "components/log/sort";

export const SearchResultTreeList = styled(({logs, dateDescending, onRowClick, className}) => {

  const removeSubsequentReplies = (logs) => {
    const visitedGroups = []
    return logs.reduce((res, log) => {
      if(log.groupId && visitedGroups.includes(log.groupId)) {
        return [...res];
      } else {
        visitedGroups.push(log.groupId);
        return [...res, log];
      }
    }, []);
  }

  const transformedLogs = removeSubsequentReplies(
    logs.map(log => ({
      ...log, 
      groupId: getLogEntryGroupId(log.properties)
    }))
    .toSorted(sortByCreatedDate(dateDescending))
  );

  return (
    <Stack
      className={`SearchResultList ${className}`}
      divider={<Divider flexItem />}
    >
      {transformedLogs?.map(log => {
        if(log.groupId) {
          return <SearchResultGroupItem key={log.id} log={log} onClick={onRowClick} dateDescending={dateDescending} />
        } else {
          return <SearchResultSingleItem key={log.id} log={log} onClick={onRowClick} />
        }
      })}
    </Stack>
  );

})({});