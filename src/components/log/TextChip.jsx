import { Chip } from "@mui/material";

export const TextChip = ({ name, value, ...props }) => {
  return (
    <Chip
      label={`${name}: ${value}`}
      aria-label={`has ${name}: ${value}`}
      size="small"
      variant="outlined"
      {...props}
    />
  );
};
