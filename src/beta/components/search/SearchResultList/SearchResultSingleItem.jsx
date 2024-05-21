import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import FormattedDate from "components/shared/FormattedDate";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { LogbookChip } from "beta/components/log/LogbookChip";
import { TagChip } from "beta/components/log/TagChip";

export const SearchResultSingleItem = ({log, selected, onClick}) => {

  return (
    <Stack 
      sx={{
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "grey.300"
        },
        paddingX: 1,
        paddingY: 0.5,
        ...(selected && {
          backgroundColor: "grey.300"
        })
      }}
      onClick={() => onClick(log)}
    >
      <Stack flexDirection="row" justifyContent="space-between">
        <Typography noWrap variant="body1" fontWeight="bold" >
          {log.title}
        </Typography>
        <Box>
          {log?.attachments?.length > 0 ? <AttachFileIcon fontSize="small" /> : null }
        </Box>
      </Stack>
      <Typography noWrap variant="caption" >
        {log.description}
      </Typography>
      <Stack flexDirection="row" justifyContent="space-between" paddingBottom={1}>
        <Typography noWrap variant="body2" fontStyle="italic">
          {log.owner}
        </Typography>
        <FormattedDate 
          date={log.createdDate}
          whiteSpace="nowrap"
          variant="body2"
          fontStyle="italic"
        />
      </Stack>
      <Stack flexDirection="row" gap={0.5} flexWrap="wrap" gridColumn="span 2">
        {log?.logbooks?.map(it => <LogbookChip key={it.name} name={it.name} />)}
        {log?.tags?.map(it => <TagChip key={it.name} name={it.name} />)}
      </Stack>
    </Stack>
  );

};