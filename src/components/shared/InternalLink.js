import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

/**
 * A semantically-correct button for navigation within the app.
 * Navigation actions should be rendered as anchor elements, not as buttons.
 */
export const InternalButtonLink = ({ children, ...props }) => {
  return (
    <Button
      component={Link}
      sx={{
        whiteSpace: "nowrap"
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
