import {
  Box,
  Button,
  IconButton,
  ImageListItemBar,
  Link,
  Stack,
  styled,
  Tooltip,
  Typography
} from "@mui/material";
import { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DownloadIcon from "@mui/icons-material/Download";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { ImageOrFile } from "components/Attachment";
import Modal from "components/shared/Modal";

const Image = styled(({ attachment, className }) => {
  return (
    <img
      className={className}
      alt={attachment.filename}
      src={attachment.url}
    />
  );
})(({ size, fullSize, height, maxWidth }) => {
  if (fullSize) {
    return {
      objectFit: "contain",
      height,
      maxWidth
    };
  } else {
    return {
      height: size,
      width: size,
      objectFit: "cover"
    };
  }
});

const FileLink = ({ attachment }) => (
  <Link
    href={attachment.url}
    download
  >
    <ImageOrFile
      attachment={attachment}
      alt={`file: ${attachment.filename}`}
      fontSize={85}
    />
  </Link>
);

const GalleryView = ({ attachments, onPrevious, onNext, currentIndex }) => {
  const attachment = attachments[currentIndex];

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      sx={{ maxWidth: "100%", maxHeight: "100%", margin: "0 auto" }}
    >
      <Image
        {...{
          attachment,
          fullSize: true,
          height: "calc(100vh - 260px)",
          maxWidth: "100%"
        }}
      />
      <Stack
        width="100%"
        maxWidth="350px"
        flexWrap="wrap"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        pt={4}
      >
        <Button
          component="a"
          href={attachment.url}
          download
          variant="outlined"
        >
          <DownloadIcon sx={{ fontSize: "1.1rem", margin: "0 5px 0 0" }} />
          Download image
        </Button>

        <Box>
          <IconButton
            onClick={onPrevious}
            sx={{ height: "min-content", marginRight: "16px" }}
            disabled={currentIndex === 0}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            onClick={onNext}
            sx={{ height: "min-content", marginLeft: "16px" }}
            disabled={currentIndex === attachments.length - 1}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Stack>
    </Stack>
  );
};

const AttachmentsGallery = ({ attachments, size = 85 }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageAttachments = attachments.filter((it) => it.isImage);
  const fileAttachments = attachments.filter((it) => !it.isImage);

  const onClick = (index) => {
    setShow(true);
    setCurrentIndex(index);
  };

  const isValidIndex = (index) => index >= 0 && index < imageAttachments.length;

  const onPrevious = () => {
    if (isValidIndex(currentIndex - 1)) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onNext = () => {
    if (isValidIndex(currentIndex + 1)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === "ArrowLeft") {
      onPrevious();
    }
    if (e.key === "ArrowRight") {
      onNext();
    }
  };

  const renderAttachmentTitle = (attachment) => {
    const splitArr = attachment.filename.split(".");
    const extension = splitArr[splitArr.length - 1];
    return `${splitArr[0].substring(0, 7)}...${extension}`;
  };

  return (
    <Stack
      mt={0.5}
      gap={1.5}
      flexWrap={"wrap"}
      flexDirection="row"
      onKeyUp={onKeyPress}
    >
      {imageAttachments.map((attachment, index) => (
        <Stack
          alignItems="center"
          key={attachment.id}
          onClick={() => onClick(index)}
          sx={{ cursor: "pointer" }}
        >
          <Image
            attachment={attachment}
            size={size}
          />
          <ImageListItemBar
            position="below"
            sx={{
              "& .MuiImageListItemBar-titleWrap": {
                padding: "4px 0 0"
              }
            }}
            title={
              <Tooltip title={attachment.filename}>
                <Typography
                  fontSize=".775rem"
                  component="span"
                >
                  {renderAttachmentTitle(attachment)}
                </Typography>
              </Tooltip>
            }
          />
        </Stack>
      ))}
      {fileAttachments.map((attachment) => (
        <Stack
          alignItems="center"
          key={attachment.id}
          sx={{
            cursor: "pointer",
            "&:hover > a > div > .file-overlay": {
              display: "block"
            }
          }}
        >
          <FileLink
            key={attachment.id}
            attachment={attachment}
          />

          <ImageListItemBar
            position="below"
            sx={{
              "& .MuiImageListItemBar-titleWrap": {
                padding: "4px 0 0"
              }
            }}
            title={
              <Tooltip title={attachment.filename}>
                <Typography
                  fontSize=".775rem"
                  component="span"
                >
                  {renderAttachmentTitle(attachment)}
                </Typography>
              </Tooltip>
            }
          />
        </Stack>
      ))}
      <Modal
        open={show}
        onClose={() => {
          setShow(false);
          setCurrentIndex(0);
        }}
        title={attachments[currentIndex].filename}
        content={
          <GalleryView
            {...{
              attachments: imageAttachments,
              currentIndex,
              setCurrentIndex,
              onPrevious,
              onNext
            }}
          />
        }
        DialogProps={{
          maxWidth: "xl",
          sx: {
            "& .MuiDialogContent-root": {
              padding: "20px"
            }
          }
        }}
      />
    </Stack>
  );
};

export default AttachmentsGallery;
