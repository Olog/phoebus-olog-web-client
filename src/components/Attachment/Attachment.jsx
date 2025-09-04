/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  styled
} from "@mui/material";
import { ImageOrFile, isImage } from "./AttachmentImage";
import Modal from "components/shared/Modal";

const ImageContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.1);
  flex-grow: 1;

  &:hover {
    cursor: pointer;
  }
`;

const Caption = styled("figcaption")`
  font-style: italic;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.9rem;
`;

const StyledAttachmentImage = styled(ImageOrFile)`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  overflow: hidden;
  flex-grow: 1;
`;

const Attachment = ({ attachment, removeAttachment, disabled, className }) => {
  const [showPreview, setShowPreview] = useState(false);

  const previewImage = () => {
    setShowPreview(true);
  };

  const attachmentFileName = attachment?.file?.name ?? attachment?.filename;

  const image = <StyledAttachmentImage attachment={attachment} />;

  return (
    <>
      <Stack
        height="160px"
        width="160px"
        gap={0.5}
        padding={0.5}
        className={className}
        component={Paper}
        variant="outlined"
        position="relative"
      >
        {!disabled ? (
          <IconButton
            onClick={() => removeAttachment(attachment.file)}
            aria-label={`remove ${attachmentFileName}`}
            size="small"
            sx={{
              position: "absolute",
              zIndex: 99,
              top: -15,
              right: -15,
              color: (theme) => theme.palette.secondary.main
            }}
          >
            <CancelIcon />
          </IconButton>
        ) : null}

        <ImageContainer onClick={previewImage}>{image}</ImageContainer>
        <Box>
          <Caption>{attachmentFileName}</Caption>
        </Box>
      </Stack>
      <Modal
        title={attachmentFileName}
        content={
          <Stack alignItems="center">
            {image}
            {isImage(attachment) ? null : (
              <Typography fontStyle="italic">(No preview available)</Typography>
            )}
          </Stack>
        }
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default Attachment;
