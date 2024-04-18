import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FormattedDate from "components/shared/FormattedDate";
import AttachFileIcon from '@mui/icons-material/AttachFile';

const LogbookChip = ({name, ...props}) => {
  return (
    <Chip 
      label={name} 
      aria-label={`has logbook ${name}`} 
      size="small"
      variant="outlined"
      color="ologPurple" 
      {...props} 
    />
  )
}

const TagChip = ({name, ...props}) => {
  return (
    <Chip 
      label={name} 
      aria-label={`has tag ${name}`} 
      icon={<LocalOfferIcon />} 
      size="small"
      variant="outlined"
      color="ologOrange" 
      {...props} 
    />
)
}

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