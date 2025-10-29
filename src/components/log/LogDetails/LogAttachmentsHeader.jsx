import { Stack, styled } from "@mui/material";
import AttachmentsGallery from "./AttachmentsGallery";
import OlogAttachment from "components/log/EntryEditor/Description/OlogAttachment";

export const LogAttachmentsHeader = styled(({ log, className }) => {
  if (!log?.attachments?.length > 0) {
    return null;
  }

  return (
    <Stack
      mb={1}
      className={className}
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
