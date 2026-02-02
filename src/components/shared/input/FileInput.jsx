import { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  styled
} from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { InternalLink } from "../Link";

const StyledDroppableFileUploadArea = styled("div")`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3.5px dashed #ddd;
  border-radius: 20px;

  &.dragging-over {
    border-color: #777;
    background-color: rgba(0, 0, 0, 0.1);
  }

  & input {
    color: transparent;
  }
`;

const StyledClickableArea = styled("div")`
  height: 160px;
  width: 100%;
  display: flex;
  padding: 0.7rem 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey[400] : theme.palette.grey[600]};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  & > * {
    cursor: inherit !important;
  }
`;

export const DroppableFileUploadInput = ({
  id,
  onFileChanged,
  className,
  multiple,
  accept,
  dragLabel,
  browseLabel,
  maxFileSizeMb,
  maxRequestSizeMb,
  disabled,
  isConvertingFile
}) => {
  const fileInputRef = useRef();
  const [error, setError] = useState("");

  const blockOperations = disabled || isConvertingFile;

  // Validates the filesize (if applicable)
  // And invokes the filechange callback if valid
  const internalOnFileChanged = (files) => {
    setError(null);
    if (maxFileSizeMb) {
      for (const file of files) {
        if (file.size > maxFileSizeMb * 1000000) {
          fileInputRef.current.value = null;
          setError(`${file.name} too large; max is ${maxFileSizeMb}MB`);
          return;
        }
      }
    }
    onFileChanged(files);
  };

  const onChange = (event) => {
    event.preventDefault();
    internalOnFileChanged(event.target.files);
  };

  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const dragAreaRef = useRef();

  const handleDragEnter = (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    dragAreaRef.current.classList.add("dragging-over");
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dragAreaRef.current.classList.remove("dragging-over");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    const dataTransfer = event.dataTransfer;
    internalOnFileChanged(dataTransfer.files);
    dragAreaRef.current.classList.remove("dragging-over");
  };

  const handleClipboardAttach = async (e) => {
    e.stopPropagation();
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const extension = type.split("/")[1];
            const file = new File([blob], `clipboard-image.${extension}`, {
              type: `image/${extension}`
            });
            onFileChanged([file]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  return (
    <StyledDroppableFileUploadArea
      ref={dragAreaRef}
      onDrop={blockOperations ? undefined : handleDrop}
      onDragEnter={blockOperations ? undefined : handleDragEnter}
      onDragOver={blockOperations ? undefined : handleDragEnter}
      onDragLeave={blockOperations ? undefined : handleDragLeave}
      className={className}
    >
      <StyledClickableArea
        onClick={blockOperations ? undefined : onClick}
        disabled={blockOperations}
      >
        <Box mb={0.5}>{disabled ? <CloudOffIcon /> : <BackupIcon />}</Box>
        {disabled ? (
          <Typography fontSize=".875rem">File upload disabled</Typography>
        ) : (
          <>
            {isConvertingFile ? (
              <CircularProgress sx={{ my: 2 }} />
            ) : (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.8}
                >
                  <InternalLink
                    onClick={onClick}
                    sx={{ fontSize: ".875rem" }}
                  >
                    {browseLabel}
                  </InternalLink>
                  <Typography fontSize=".875rem">or</Typography>
                  <Typography
                    component="span"
                    fontSize=".875rem"
                    fontWeight="bold"
                  >
                    {dragLabel}
                  </Typography>
                </Stack>
                <Button
                  sx={{ width: "fit-content", mt: 1.5, mb: 1 }}
                  variant="outlined"
                  disabled={blockOperations}
                  onClick={handleClipboardAttach}
                >
                  Attach image from clipboard
                </Button>
              </>
            )}
            <Typography
              mt={0.5}
              fontSize=".78rem"
            >
              (max size per file: {maxFileSizeMb}MB, max total form size:{" "}
              {maxRequestSizeMb}MB)
            </Typography>
          </>
        )}
      </StyledClickableArea>
      <input
        id={id}
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        multiple={multiple}
        accept={accept}
        hidden
        disabled={disabled}
      />
      {error ? (
        <Typography
          mb={2}
          variant="body2"
          fontStyle="italic"
          color="error"
        >
          {error}
        </Typography>
      ) : null}
    </StyledDroppableFileUploadArea>
  );
};

export default DroppableFileUploadInput;
