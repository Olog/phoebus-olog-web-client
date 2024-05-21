import React from "react";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Chip } from "@mui/material";

export const TagChip = ({name, ...props}) => {
  return (
    <Chip 
      label={name} 
      aria-label={`has tag ${name}`} 
      icon={<LocalOfferIcon />} 
      size="small"
      variant="outlined"
      color="ologOrange" 
      {...props} 
    />
  );
};