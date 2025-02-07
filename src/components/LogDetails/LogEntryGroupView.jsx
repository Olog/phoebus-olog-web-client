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

import { useEffect } from "react";
import { styled } from "@mui/material";
import GroupHeader from "./GroupHeader";
import { getLogEntryGroupId } from "../Properties/utils";
import { CommonMark } from "components/shared/CommonMark";
import customization from "config/customization";
import { sortByCreatedDate } from "components/log/sort";
import { ologApi } from "api/ologApi";
import useBetaNavigate from "hooks/useBetaNavigate";

const Container = styled("div")`
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  overflow: auto;
`;

const GroupContainer = styled("li")`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

/**
 * Merged view of all log entries
 */
const LogEntryGroupView = ({
  currentLogEntry,
  logGroupRecords,
  setLogGroupRecords,
  className
}) => {
  const navigate = useBetaNavigate();
  const [getLogGroup] = ologApi.endpoints.getLogGroup.useLazyQuery();

  useEffect(() => {
    const res = getLogGroup({
      groupId: getLogEntryGroupId(currentLogEntry?.properties)
    });
    res
      .unwrap()
      .then((data) => {
        setLogGroupRecords(data.toSorted(sortByCreatedDate(false)));
      })
      .catch((error) => {
        console.error("Could not fetch logs by group", error);
      });

    return () => {
      res.abort();
    };
  }, [currentLogEntry?.properties, getLogGroup, setLogGroupRecords]);

  const showLog = (log) => {
    navigate(`/logs/${log.id}`);
  };

  const logGroupItems = logGroupRecords.map((row, index) => {
    return (
      <GroupContainer
        key={index}
        onClick={() => showLog(row)}
      >
        <GroupHeader logEntry={row} />
        <CommonMark
          commonmarkSrc={row.source}
          imageUrlPrefix={customization.APP_BASE_URL + "/"}
        />
      </GroupContainer>
    );
  });

  return (
    <Container className={className}>
      <ol aria-label="Group Entries">{logGroupItems}</ol>
    </Container>
  );
};

export default LogEntryGroupView;
