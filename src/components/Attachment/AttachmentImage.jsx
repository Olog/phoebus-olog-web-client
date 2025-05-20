import { Box, Stack } from "@mui/material";

export const isLocalFile = (attachment) => {
  return Boolean(attachment?.file);
};

export const isImage = (attachment) => {
  if (attachment.file) {
    return attachment?.file?.type?.toLowerCase()?.startsWith("image");
  } else {
    return attachment.fileMetadataDescription
      ?.toLowerCase()
      ?.startsWith("image");
  }
};

export const FileImage = ({ attachment, alt, className, ...props }) => {
  return (
    <Stack
      fontSize="5rem"
      color="gray"
      justifyContent="center"
      alignItems="center"
      position="relative"
      className={className}
      {...props}
    >
      <Box
        className="file-overlay"
        sx={{
          display: "none",
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "white",
          opacity: 0.6,
          zIndex: 1
        }}
      />
      <img
        src={attachment.url}
        alt={alt}
        style={{
          width: "100%",
          objectFit: "contain",
          overflow: "hidden"
        }}
      />
    </Stack>
  );
};
