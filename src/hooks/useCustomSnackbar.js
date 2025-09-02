import { useSnackbar } from "notistack";
import { useCallback } from "react";

export const useCustomSnackbar = () => {
  const { enqueueSnackbar: enqueue, closeSnackbar } = useSnackbar();

  const enqueueSnackbar = useCallback(
    (message, options) => {
      return enqueue(message, {
        variant: "customSnackbar",
        autoHideDuration: 8000,
        ...options
      });
    },
    [enqueue]
  );

  return { enqueueSnackbar, closeSnackbar };
};
