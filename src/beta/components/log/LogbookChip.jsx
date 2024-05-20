import React from "react";
import { Chip } from "@mui/material";

export const LogbookChip = ({name, ...props}) => {
  return (
    <Chip 
      label={name} 
      aria-label={`has logbook ${name}`} 
      size="small"
      variant="outlined"
      color="ologPurple" 
      {...props} 
    />
  );
};