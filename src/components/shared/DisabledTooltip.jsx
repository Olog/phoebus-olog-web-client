import { Box, Tooltip } from "@mui/material";

export const DisabledTooltip = ({ reason, children }) => (
  <Tooltip title={reason}>
    <Box
      sx={reason ? { "& *": { cursor: "not-allowed !important" } } : undefined}
    >
      {children}
    </Box>
  </Tooltip>
);
