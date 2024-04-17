import React from "react";
import { Box, Stack, Typography, styled } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';

export const GroupChild = styled(({log, onClick = () => {}, className}) => {

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr minmax(10%, 0.5fr)",
        width: "100%",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "grey.300"
        }
      }}
      onClick={() => onClick(log)}
      className={`group-child ${className}`} 
    >
      <Typography flex={2} variant="body2" fontStyle="italic" sx={{ verticalAlign: "bottom"}} >{log.owner}</Typography>
      <Typography flex={2} variant="caption" noWrap sx={{ verticalAlign: "baseline"}}>{log.description}</Typography>
      <Stack flex={1} flexDirection="row" justifyContent="flex-end" gap={1}>
        {log.attachments && log.attachments.length > 0 ? <AttachFileIcon fontSize="small" titleAccess="has attachments" /> : null}
      </Stack>
    </Box>
  );

})({});