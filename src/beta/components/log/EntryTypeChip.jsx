import { Chip } from "@mui/material";
import React from "react";

export const EntryTypeChip = ({value, ...props}) => {

  return (
    <Chip
      label={`type: ${value}`} 
      aria-label={`has level ${value}`} 
      size="small"
      variant="outlined"
      color="ologBlack" 
      {...props} 
    />
  );
};