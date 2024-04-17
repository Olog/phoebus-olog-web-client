import React, { useState } from "react";
import { Box, CircularProgress, IconButton, Stack, Tooltip, styled } from "@mui/material";
import { ologApi } from "api/ologApi";
import { getLogEntryGroupId } from "components/Properties";
import { GroupParent } from "./GroupParent";
import { GroupChild } from "./GroupChild";
import { sortByCreatedDate } from "components/log/sort";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export const SearchResultGroupItem = styled(({log, onClick=() => {}, dateDescending=true}) => {

  const [expanded, setExpanded] = useState(true);
  const { data: replies, isLoading: repliesLoading, error: repliesError } = ologApi.endpoints.getLogGroup.useQuery(
    {groupId: getLogEntryGroupId(log?.properties ?? [])}
  );

  const onExpandClick = () => {
    setExpanded(!expanded);
  }

  let renderedIcon = (
    <IconButton
      onClick={onExpandClick}
      size="small"
      aria-expanded={expanded ? "true": "false"}
    >
      {expanded
        ? <RemoveCircleOutlineIcon fontSize="inherit" /> 
        : <AddCircleOutlineIcon fontSize="inherit" />
      }
    </IconButton>
  );

  if(repliesLoading) {
    renderedIcon = (
      <CircularProgress size={15} />
    );
  }
  if(repliesError) {
    renderedIcon = (
      <Tooltip title="unable to load replies">
        <ErrorOutlineIcon color="error" fontSize="inherit" />
      </Tooltip>
    );
  }

  return (
    <Stack sx={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 14px) 10px auto",
      "& .group-parent-icon": {
        gridColumn: "span 2"
      },
      "& .group-parent": {
        gridColumn: "span 2"
      },
      "& .group-child-connector": {
        borderWidth: 0,
        borderStyle: "solid",
        borderColor: "grey.500"
      },
      "& .group-child-connector-line": {
        position: "relative",
        borderRightWidth: 1
      },
      "& .group-child-connector-line.last": {
        borderRightWidth: "0px !important"
      },
      "& .group-child-elbow": {
        height: "50%",
        position: "relative",
        right: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderBottomLeftRadius: "75%",
      },
      "& .reply-is-parent-icon": {
        position: "relative",
        right: 6
      }
    }}>
      <Stack justifyContent="center" alignItems="center" className="group-parent-icon">
        {renderedIcon}
      </Stack>
      <GroupParent log={log} replyCount={replies?.length ?? null} onClick={onClick} />
      {replies && expanded ? replies
        .toSorted(sortByCreatedDate(dateDescending))
        .map((reply, index) => {
          const replyIsParent = reply.id === log.id;
          return (
            <React.Fragment key={reply.id}>
              <Box className={`group-child-connector group-child-connector-line ${index === replies.length -1 ? "last": "" }`} />
              <Box className="group-child-connector group-child-elbow" />
              {replyIsParent ? <ArrowRightIcon fontSize="small" className="reply-is-parent-icon" /> : null }
              <Box gridColumn={replyIsParent ? "span 1" : "span 2"}>
                <GroupChild log={reply} onClick={onClick} />
              </Box>
            </React.Fragment>
          )
        }) : null}
    </Stack>
  );
})({});