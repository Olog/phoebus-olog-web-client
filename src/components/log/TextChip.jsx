import { Chip } from "@mui/material";

export const TextChip = ({ name, value, onDelete, ...props }) => {
  return (
    <Chip
      label={`${name}: ${value}`}
      aria-label={`has ${name}: ${value}`}
      size="small"
      variant="outlined"
      onDelete={() => onDelete(name)}
      {...props}
    />
  );
};
