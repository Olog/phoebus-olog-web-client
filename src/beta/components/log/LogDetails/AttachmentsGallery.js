import { IconButton, ImageList, ImageListItem, Link, Stack, styled } from "@mui/material";
import React, { useState } from "react";
import { FileImage } from "components/Attachment";
import Modal from "components/shared/Modal";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const Image = styled(({ attachment, className }) => {

  return (
    <img
      className={className}
      alt={attachment.filename}
      src={attachment.url}
    />
  )
})(({ size, fullSize, maxHeight, maxWidth }) => {
  if (fullSize) {
    return {
      objectFit: "contain",
      maxHeight, maxWidth
    }
  } else {
    return {
      height: size,
      width: size,
      objectFit: "cover"
    }
  }
});

const FileLink = ({ attachment, size }) => (
  <Link href={attachment.url} download>
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
    <Stack flexDirection="row" alignItems="center" justifyContent="center">
      <IconButton
        onClick={onPrevious}
        sx={{ height: "min-content" }}
        disabled={currentIndex === 0}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <Image {...{ attachment, fullSize: true, maxHeight: 500, maxWidth: 500 }} />
      <IconButton
        onClick={onNext}
        sx={{ height: "min-content" }}
        disabled={currentIndex === attachments.length - 1}
      >
        <NavigateNextIcon />
      </IconButton>
    </Stack>
  )
}

const AttachmentsGallery = ({ attachments, size = 100 }) => {

  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageAttachments = attachments.filter(it => it.isImage);
  const fileAttachments = attachments.filter(it => !it.isImage);

  const onClick = (index) => {
    setShow(true);
    setCurrentIndex(index);
  }

  const isValidIndex = (index) => {
    if (index >= 0 && index < attachments.length) {
      return true;
    }
    return false;
  }

  const onPrevious = () => {
    if (isValidIndex(currentIndex - 1)) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const onNext = () => {
    if (isValidIndex(currentIndex + 1)) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const onKeyPress = (e) => {
    if (e.key === "ArrowLeft") {
      onPrevious();
    }
    if (e.key === "ArrowRight") {
      onNext();
    }
  }

  return (
    <Stack onKeyUp={onKeyPress} >
      <ImageList gap={5} cols={10} >
        {imageAttachments.map((attachment, index) => (
          <ImageListItem key={attachment.id} onClick={() => onClick(index)} sx={{ cursor: "pointer" }}>
            <Image attachment={attachment} size={size} />
          </ImageListItem>
        ))}
        {fileAttachments.map((attachment) => (
          <FileLink key={attachment.id} attachment={attachment} size={size} />
        ))}
      </ImageList>
      <Modal
        open={show}
        onClose={() => setShow(false)}
        title={attachments[currentIndex].filename}
        content={<GalleryView {...{ attachments: imageAttachments, currentIndex, setCurrentIndex, onPrevious, onNext }} />}
      />
    </Stack>
  );

};

export default AttachmentsGallery;