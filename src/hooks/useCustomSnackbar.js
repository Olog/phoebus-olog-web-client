import { useSnackbar } from "notistack";

export const useCustomSnackbar = () => {
  const { enqueueSnackbar: enqueue, closeSnackbar } = useSnackbar();

  const enqueueSnackbar = (message, options) => {
    return enqueue(message, {
      variant: "customSnackbar",
      autoHideDuration: 8000,
      ...options
    });
  };

  return { enqueueSnackbar, closeSnackbar };
};
