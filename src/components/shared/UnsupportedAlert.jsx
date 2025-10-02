import { Alert } from "@mui/material";

export const UnsupportedAlert = ({ state }) => {
  const { unsupportedFileTypes, unsupportedFileNames, setUnsupportedFiles } =
    state;
  return (
    <Alert
      severity="error"
      onClose={() => setUnsupportedFiles([])}
    >
      Unsupported file format ({unsupportedFileTypes}
      ): {unsupportedFileNames}
    </Alert>
  );
};
