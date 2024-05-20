import { Chip } from "@mui/material";
import React from "react";

export const EntryTypeChip = ({name, ...props}) => {

  return (
    <Chip
      label={name} 
      aria-label={`has logbook ${name}`} 
      size="small"
      variant="outlined"
      color="ologBlack" 
      {...props} 
    />
  );
};