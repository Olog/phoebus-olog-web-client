import React from "react";
import { Badge, Box, Stack, Tooltip, Typography, styled } from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';

export const GroupParent = styled(({log, replyCount, onClick, className}) => {

  return (
    <Box
      sx={{
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "1fr max-content",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "grey.300"
        },
        paddingRight: 1.5
      }}
      onClick={() => onClick(log)}
      className={`group-parent ${className}`}
    >
      <Tooltip title={log.title}>
        <Typography noWrap fontWeight="bold">{log.title}</Typography>
      </Tooltip>
      <Stack flexDirection="row" justifyContent="flex-end" gap={1}>
        <Badge 
          badgeContent={replyCount ?? null}
          color="secondary"
          aria-label={`${replyCount ?? 0} replies`}
          sx={(theme) => ({
            "& .MuiBadge-badge": {
              height: "1rem",
              right: 2,
              top: 6,
              border: `1px solid ${theme.palette.background.paper}`
            }
          })}
        >
          <ReplyIcon />
        </Badge>
      </Stack>
    </Box>
  );

})({});