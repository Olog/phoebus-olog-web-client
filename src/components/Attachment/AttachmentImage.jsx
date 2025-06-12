import { Box, Stack } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";

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
      {isImage(attachment) ? (
        <img
          src={attachment.url}
          alt={alt}
          style={{
            width: "100%",
            objectFit: "contain",
            overflow: "hidden"
          }}
        />
      ) : (
        <>
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
          {!isLocalFile(attachment) && (
            <DownloadIcon
              className="file-overlay"
              sx={{
                color: "gray",
                width: "22px",
                height: "22px",
                position: "absolute",
                left: "33px",
                bottom: "25px",
                zIndex: 2
              }}
            />
          )}
          <InsertDriveFileIcon
            titleAccess={"file: " + alt}
            fontSize="inherit"
          />
        </>
      )}
    </Stack>
  );
};
