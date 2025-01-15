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
import { useHref, useLocation } from "react-router-dom";
import { Box, Button, Divider, Stack, styled } from "@mui/material";
import NavigationButtons from "./NavigationButtons";
import LogEntrySingleView from "./LogEntrySingleView";
import LogEntryGroupView from "./LogEntryGroupView";
import { getLogEntryGroupId } from "../Properties/utils";
import { useUser } from "features/authSlice";
import { InternalButtonLink } from "components/shared/Link";
import customization from "config/customization";

const StyledLogEntrySingleView = styled(LogEntrySingleView)`
  overflow: auto;
`;
const StyledLogEntryGroupView = styled(LogEntryGroupView)`
  overflow: auto;
`;

/**
 * A view show all details of a log entry. Images are renderd, if such are
 * present. Other types of attachments are rendered as links.
 */
const LogDetails = ({
  showGroup,
  setShowGroup,
  currentLogEntry,
  logGroupRecords,
  setLogGroupRecords,
  searchResults,
  className
}) => {
  const user = useUser();

  const renderedEditButton = customization.log_edit_support ? (
    <InternalButtonLink
      to={`/logs/${currentLogEntry?.id}/edit`}
      disabled={!user || !user.userName}
      variant="contained"
    >
      Edit
    </InternalButtonLink>
  ) : null;

  const renderedReplyButton = customization.log_entry_groups_support ? (
    <InternalButtonLink
      to={`/logs/${currentLogEntry?.id}/reply`}
      variant="contained"
      disabled={!user || !user.userName}
      sx={{ height: "100%" }}
    >
      Reply
    </InternalButtonLink>
  ) : null;

  const currentPath = useHref(useLocation());

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.origin + currentPath);
  };

  const renderedShowGroupButton = getLogEntryGroupId(
    currentLogEntry.properties
  ) ? (
    <Button
      variant="contained"
      onClick={() => setShowGroup(!showGroup)}
    >
      {showGroup ? "Hide" : "Show"} Group
    </Button>
  ) : null;

  const renderedLogView = showGroup ? (
    <StyledLogEntryGroupView
      {...{
        showGroup,
        setShowGroup,
        currentLogEntry,
        user,
        logGroupRecords,
        setLogGroupRecords
      }}
    />
  ) : (
    <StyledLogEntrySingleView currentLogEntry={currentLogEntry} />
  );

  return (
    <Stack
      className={className}
      id="logdetails-and-buttons"
      flexDirection="column"
      width="100%"
      overflow="hidden"
    >
      <Stack
        flexDirection="row"
        gap={1}
        borderBottom={0}
        padding={1}
        flexWrap="wrap"
      >
        <NavigationButtons
          {...{
            currentLogEntry,
            searchResults
          }}
          order={0}
        />
        <Stack
          flexDirection="row"
          gap={1}
          order={2}
          sx={{ flexBasis: ["100%", "auto"] }}
        >
          {renderedEditButton}
          {renderedReplyButton}
          {renderedShowGroupButton}
        </Stack>
        <Button
          variant="contained"
          onClick={copyUrl}
          sx={{
            marginLeft: "auto",
            order: [0, 3]
          }}
        >
          Copy URL
        </Button>
      </Stack>
      <Divider />
      <Box
        id="logdetails"
        overflow="hidden"
      >
        {renderedLogView}
      </Box>
    </Stack>
  );
};

export default LogDetails;
