import { Alert } from "@mui/material";
import { SnackbarContent, useSnackbar } from "notistack";
import { forwardRef } from "react";

export const CustomSnackbar = forwardRef(({ id, message, severity }, ref) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <SnackbarContent ref={ref}>
      <Alert
        severity={severity}
        variant="filled"
        onClose={() => closeSnackbar(id)}
      >
        {message}
      </Alert>
    </SnackbarContent>
  );
});

CustomSnackbar.displayName = "CustomSnackbar";
