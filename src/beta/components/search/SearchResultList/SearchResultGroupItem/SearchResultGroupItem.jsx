import React, { useState } from "react";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { SearchResultSingleItem } from "..";
import { useCurrentLogEntry } from "features/currentLogEntryReducer";

export const SearchResultGroupItem = styled(({ log, onClick = () => { }, handleKeyDown }) => {

  const currentLogEntry = useCurrentLogEntry();
  const currentLogEntryId = Number(currentLogEntry?.id);

  const [expanded, setExpanded] = useState(true);
  const onExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  }

  const ExpandIcon = () => (
    <Stack mt={1.5} flexDirection="row" alignItems="center" onClick={onExpandClick} sx={{ cursor: "pointer", width: "fit-content" }}>
      <IconButton
        sx={{ color: "#0099db", padding: "0 5px 0 0" }}
        size="small"
        aria-expanded={expanded ? "true" : "false"}
      >
        {expanded
          ? <RemoveCircleOutlineIcon fontSize="inherit" />
          : <AddCircleOutlineIcon fontSize="inherit" />
        }
      </IconButton>
      <Typography color="#0099db" variant="body2">{expanded ? "Hide" : "Show"} replies</Typography>
    </Stack>
  );

  return (
    <>
      <SearchResultSingleItem log={log} selected={currentLogEntryId === log.id} onClick={onClick} expandIcon={<ExpandIcon />} handleKeyDown={handleKeyDown} />

      {expanded && log?.replies.map(reply => (
        <SearchResultSingleItem log={reply} selected={currentLogEntryId === reply.id} onClick={onClick} isReply={true} handleKeyDown={handleKeyDown} />
      ))}
    </>
  );
})({});