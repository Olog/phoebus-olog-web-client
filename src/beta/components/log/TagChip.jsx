import React from "react";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Chip } from "@mui/material";

export const TagChip = ({value, ...props}) => {
  return (
    <Chip 
      label={value} 
      aria-label={`has tag ${value}`} 
      icon={<LocalOfferIcon />} 
      size="small"
      variant="outlined"
      color="ologOrange" 
      {...props} 
    />
  );
};