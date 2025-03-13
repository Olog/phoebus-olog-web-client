import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Stack,
  styled,
  Typography
} from "@mui/material";
import { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { FileImage } from "components/Attachment";
import Modal from "components/shared/Modal";

const Image = styled(({ attachment, className }) => {
  return (
    <img
      className={className}
      alt={attachment.filename}
      src={attachment.url}
    />
  );
})(({ size, fullSize, maxHeight, maxWidth }) => {
  if (fullSize) {
    return {
      objectFit: "contain",
      maxHeight,
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

const FileLink = ({ attachment, size }) => (
  <Link
    href={attachment.url}
    download
  >
    <FileImage
      alt={`file: ${attachment.filename}`}
      fontSize={size}
      sx={{
        height: size,
        width: size
      }}
    />
  </Link>
);

const GalleryView = ({ attachments, onPrevious, onNext, currentIndex }) => {
  const attachment = attachments[currentIndex];

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ maxWidth: "100%", maxHeight: "100%", margin: "0 auto" }}
    >
      <IconButton
        onClick={onPrevious}
        sx={{ height: "min-content", marginRight: "16px" }}
        disabled={currentIndex === 0}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <Box>
        <Link
          href={attachment.url}
          target="_blank"
        >
          <Image
            {...{
              attachment,
              fullSize: true,
              maxHeight: "500px",
              maxWidth: "100%"
            }}
          />
        </Link>
      </Box>
      <IconButton
        onClick={onNext}
        sx={{ height: "min-content", marginLeft: "16px" }}
        disabled={currentIndex === attachments.length - 1}
      >
        <NavigateNextIcon />
      </IconButton>
    </Stack>
  );
};

const AttachmentsGallery = ({ attachments, size = 100 }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageAttachments = attachments.filter((it) => it.isImage);
  const fileAttachments = attachments.filter((it) => !it.isImage);

  const onClick = (index) => {
    setShow(true);
    setCurrentIndex(index);
  };

  const isValidIndex = (index) => {
    if (index >= 0 && index < attachments.length) {
      return true;
    }
    return false;
  };

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
    return `${splitArr[0].substring(0, 9)}...${extension}`;
  };

  return (
    <Stack onKeyUp={onKeyPress}>
      <ImageList
        gap={5}
        cols={10}
        sx={{ marginBottom: 0 }}
      >
        {imageAttachments.map((attachment, index) => (
          <ImageListItem
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
              title={renderAttachmentTitle(attachment)}
              fontSize="small"
              sx={{
                "& div": {
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  paddingBottom: 0
                }
              }}
            />
          </ImageListItem>
        ))}
        {fileAttachments.map((attachment) => (
          <Stack
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
              size={size}
            />
            <Stack flexDirection="row">
              <Typography
                pl={2}
                sx={{ fontSize: "0.8rem", fontStyle: "italic" }}
                mt={1}
              >
                {renderAttachmentTitle(attachment)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </ImageList>
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
      />
    </Stack>
  );
};

export default AttachmentsGallery;
