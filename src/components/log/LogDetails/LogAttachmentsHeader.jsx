import { Stack, styled } from "@mui/material";
import AttachmentsGallery from "./AttachmentsGallery";
import OlogAttachment from "components/log/EntryEditor/Description/OlogAttachment";

export const LogAttachmentsHeader = styled(({ log, className }) => {
  if (!log?.attachments?.length > 0) {
    return null;
  }

  return (
    <Stack
      className={className}
      mb={1}
    >
      <AttachmentsGallery
        attachments={
          log?.attachments?.map(
            (it) => new OlogAttachment({ attachment: it })
          ) ?? []
        }
      />
    </Stack>
  );
})({});
