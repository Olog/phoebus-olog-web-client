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

import { useEffect, useState } from "react";
import Modal from "../../../shared/Modal";
import { CommonMark } from "../../../shared/CommonMark";
import customization from "config/customization";

const mdImageRegex = new RegExp(
  `!\\[([^\\]]*)\\]\\(${customization.APP_BASE_URL}/attachment/([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\\)\\{width=(\\d+) height=(\\d+)\\}`,
  "g"
);

const HtmlPreviewModal = ({
  commonmarkSrc,
  attachedFiles,
  showHtmlPreview,
  setShowHtmlPreview,
  useRemoteAttachments
}) => {
  const [modifiedPreviewContent, setModifiedPreviewContent] =
    useState(commonmarkSrc);

  useEffect(() => {
    if (!useRemoteAttachments) {
      let newContent = commonmarkSrc;

      // Replaces the remote image url with a local blob url for preview purposes
      const matches = [...commonmarkSrc.matchAll(mdImageRegex)];
      matches.forEach((match) => {
        const altText = match[1];
        const id = match[2];
        const width = match[3];
        const height = match[4];
        const file = attachedFiles.find((file) => file.id === id);

        if (file) {
          newContent = newContent.replace(
            match[0],
            `![${altText}](${file.url}){width=${width} height=${height}}`
          );
        }
      });

      setModifiedPreviewContent(newContent);
    }
  }, [commonmarkSrc, attachedFiles, useRemoteAttachments]);

  return (
    <Modal
      open={showHtmlPreview}
      onClose={() => setShowHtmlPreview(false)}
      title="Description Preview"
      content={
        <CommonMark
          commonmarkSrc={modifiedPreviewContent}
          isPreview
        />
      }
      DialogProps={{
        fullWidth: true,
        maxWidth: "lg"
      }}
    />
  );
};

export default HtmlPreviewModal;
