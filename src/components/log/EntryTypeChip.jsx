import { Chip } from "@mui/material";
export const EntryTypeChip = ({ value, ...props }) => (
  <Chip
    label={`${value}`}
    aria-label={`has level ${value}`}
    size="small"
    variant="outlined"
    color="ologBlack"
    {...props}
  />
);
