/**
 * Copyright (C) 2020 European Spallation Source ERIC.
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

import { Box, Divider, Typography, styled } from "@mui/material";
import LogDetailsMetaData from "./LogDetailsMetaData";
import Properties from "../Properties/Properties";
import Collapse from "components/shared/Collapse";
import { CommonMark } from "components/shared/CommonMark";
import customization from "config/customization";
import AttachmentImage, {
  isImage
} from "components/Attachment/AttachmentImage";

const Container = styled("div")`
  padding: 0.5rem;
  height: 100%;
  overflow: auto;
`;

const LogTitle = styled("div")`
  display: flex;
  justify-content: space-between;

  &,
  & h2 {
    font-size: 1.4rem;
    font-weight: normal;
  }
`;

const StyledCommonmarkPreview = styled(CommonMark)`
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  wordwrap: break-word;
  font-size: 1.2rem;
  overflow: auto;
`;

const StyledAttachmentImage = styled(AttachmentImage)`
  width: 100%;

  &:hover {
    cursor: pointer;
  }
`;

const LogEntrySingleView = ({ currentLogEntry, className }) => {
  const attachments = currentLogEntry.attachments.map((attachment, index) => {
    const url = `${customization.APP_BASE_URL}/attachment/` + attachment.id;

    if (isImage(attachment)) {
      return (
        <Box key={index}>
          <StyledAttachmentImage
            onClick={() => {
              let w = window.open("", attachment.filename);
              w.document.open();
              w.document.write(
                "<html><head><title>" + attachment.filename + "</title></head>"
              );
              w.document.write(
                "<body><p><img src='" + url + "'></p></body></html>"
              );
              w.document.close();
            }}
            attachment={attachment}
          />
        </Box>
      );
    } else {
      return (
        <Box key={index}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={url}
          >
            {attachment.filename}
          </a>
        </Box>
      );
    }
  });

  const properties = currentLogEntry.properties
    .filter((property) => property.name !== "Log Entry Group")
    .map((property, index) => (
      <Properties
        key={index}
        property={property}
      />
    ));

  return (
    <Container className={className}>
      <LogTitle>
        <Typography
          component="h2"
          variant="h2"
        >
          {currentLogEntry.title}
        </Typography>
        <Typography component="span">{currentLogEntry.id}</Typography>
      </LogTitle>
      <Divider sx={{ marginY: 1 }} />
      <LogDetailsMetaData currentLogRecord={currentLogEntry} />
      <Divider sx={{ marginY: 1 }} />
      <StyledCommonmarkPreview
        commonmarkSrc={currentLogEntry.source}
        imageUrlPrefix={customization.APP_BASE_URL + "/"}
      />
      <Collapse title="Attachments">
        {currentLogEntry.attachments.length > 0 ? (
          <Box>{attachments}</Box>
        ) : (
          <Typography>No Attachments</Typography>
        )}
      </Collapse>
      <Collapse title="Properties">
        {properties?.length > 0 ? (
          properties
        ) : (
          <Typography>No Properties</Typography>
        )}
      </Collapse>
    </Container>
  );
};

export default LogEntrySingleView;
