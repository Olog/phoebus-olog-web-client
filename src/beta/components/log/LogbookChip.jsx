import { Chip } from "@mui/material";

export const LogbookChip = ({ value, ...props }) => {
  return (
    <Chip
      label={value}
      aria-label={`has logbook ${value}`}
      size="small"
      variant="outlined"
      color="ologPurple"
      {...props}
    />
  );
};
