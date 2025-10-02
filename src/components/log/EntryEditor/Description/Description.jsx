import { Alert, Box, Button, Stack, Typography, styled } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { FaMarkdown } from "react-icons/fa";
import EmbedImageDialog from "./EmbedImageDialog";
import HtmlPreviewModal from "./HtmlPreviewModal";
import removeImageMarkup from "./removeImageMarkup";
import OlogAttachment from "./OlogAttachment";
import { ologApi } from "api/ologApi";
import { ExternalLink } from "components/shared/Link";
import { TextInput } from "components/shared/input/TextInput";
import Attachment from "components/Attachment/Attachment";
import customization from "config/customization";
import { DroppableFileUploadInput } from "components/shared/input/FileInput";
import { parseUrlToMarkdown } from "src/hooks/parseUrlToMarkdown";
import { useUnsupported } from "src/hooks/useUnsupported";
import { UnsupportedAlert } from "src/components/shared/UnsupportedAlert";

const RenderedAttachmentsContainer = styled("div")(
  ({ hasAttachments, theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    columnGap: ".7rem",
    rowGap: "1rem",
    padding: "0.5rem",
    border: `solid 1px ${theme.palette.gray}`,
    borderRadius: "5px",
    "& > div": {
      width: hasAttachments ? "160px" : "100%"
    },
    "& > div:nth-child(1)": {
      width: hasAttachments ? "fit-content" : "100%"
    }
  })
);

const Description = ({ form, isEditing }) => {
  const { control, formState, getValues, setValue } = form;
  const descriptionRef = useRef();

  const [maxRequestSizeMb, setMaxRequestSizeMb] = useState(
    customization.defaultMaxRequestSizeMb
  );
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(
    customization.defaultMaxFileSizeMb
  );
  const [initialImage, setInitialImage] = useState(null);
  const [showEmbedImageDialog, setShowEmbedImageDialog] = useState(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  const unsupportedState = useUnsupported();
  const { unsupportedFiles, setUnsupportedFiles, checkIsUnsupported } =
    unsupportedState;

  const {
    fields: attachments,
    remove: removeAttachment,
    append: appendAttachment
  } = useFieldArray({
    control,
    name: "attachments",
    keyName: "reactHookFormId", // default is 'id', which would override OlogAttachment#id
    rules: {
      validate: {
        maxRequestSize: (attachments) => {
          const total =
            attachments
              ?.map((it) => it?.file?.size || 0)
              ?.reduce((prev, curr) => curr + prev, 0) ?? 0;
          const max = maxRequestSizeMb * 1000000;
          return (
            total < max ||
            `Attachments exceed total maximum upload size of ${maxRequestSizeMb}MB`
          );
        },
        maxFileSize: (attachments) => {
          const max = maxFileSizeMb * 1000000;
          const results =
            attachments
              ?.filter((it) => it?.file?.size > max)
              ?.map((it) => it?.file?.name) ?? [];
          return (
            results.length === 0 ||
            `Attachments exceed max filesize (${maxFileSizeMb}MB): ${results}`
          );
        }
      }
    }
  });

  const parsedAttachments = useMemo(
    () =>
      attachments?.map((it) => new OlogAttachment({ attachment: it })) ?? [],
    [attachments]
  );

  const { data: serverInfo } = ologApi.endpoints.getServerInfo.useQuery();

  const generateUniqueFileName = (file) => {
    const splitFileName = file.name.split(".");
    const name = splitFileName[0] ?? "unknown";
    const extension = splitFileName[1] ?? ".jpg";
    return new File([file], `${name}-${new Date().getTime()}.${extension}`, {
      type: file.type,
      lastModified: file.lastModified
    });
  };

  /**
   * Appends an attachment object to the attachments form field
   * @param {*} event
   */
  const onFileChanged = (files) => {
    if (files) {
      // note event.target.files is a FileList, not an array! But we can convert it
      Array.from(files).forEach((file) => {
        if (checkIsUnsupported(file)) {
          return;
        }
        setUnsupportedFiles([]);
        appendAttachment(
          new OlogAttachment({
            file: generateUniqueFileName(file),
            id: uuidv4()
          })
        );
      });
    }
  };

  /**
   * When an attachment is removed, update the internal state
   * and also remove any embeds found in the description
   */
  const onAttachmentRemoved = (attachment, index) => {
    let description = getValues("description") || "";
    if (description.indexOf(attachment.id) > -1) {
      // Find potential markup referencing the attachment
      let updatedDescription = removeImageMarkup(description, attachment.id);
      setValue("description", updatedDescription);
    }
    removeAttachment(index);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const items = Array.from(e.clipboardData.items);
    for (let item of items) {
      if (item.kind === "file" && item.type.match(/^image/)) {
        const imageFile = item.getAsFile();
        if (checkIsUnsupported(imageFile)) {
          return;
        }
        setUnsupportedFiles([]);

        if (!isEditing && imageFile) {
          setInitialImage(imageFile);
          setShowEmbedImageDialog(true);
        }
      }

      if (item.kind === "string" && item.type.match(/^text\/plain$/)) {
        item.getAsString((text) => {
          const { parsedContent, cursorPosition } = parseUrlToMarkdown(
            text,
            descriptionRef
          );

          setValue("description", parsedContent, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false
          });

          // Set correct cursor position after paste
          setTimeout(() => {
            if (descriptionRef.current) {
              descriptionRef.current.selectionStart = cursorPosition;
              descriptionRef.current.selectionEnd = cursorPosition;
            }
          }, 0);
        });
      }
    }
  };

  /**
   * Inserts image markup into the description field
   * @param {*} file
   * @param {*} width
   * @param {*} height
   */
  const addEmbeddedImage = (file, width, height) => {
    const id = uuidv4();
    appendAttachment(
      new OlogAttachment({ file: generateUniqueFileName(file), id })
    );
    const imageMarkup = `![](attachment/${id}){width=${width} height=${height}}`;
    let description = getValues("description") || "";
    description += imageMarkup;
    setValue("description", description, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false
    });
  };

  // Set the max attachment filesize
  useEffect(() => {
    if (serverInfo?.serverConfig) {
      setMaxRequestSizeMb(
        serverInfo.serverConfig?.maxRequestSize ??
          customization.defaultMaxRequestSizeMb
      );
      setMaxFileSizeMb(
        serverInfo.serverConfig?.maxFileSize ??
          customization.defaultMaxFileSizeMb
      );
    }
  }, [serverInfo]);

  return (
    <Stack gap={1}>
      <TextInput
        name="description"
        label="Description"
        control={control}
        defaultValue=""
        multiline
        minRows={7}
        maxRows={12}
        sx={{ "& .MuiInputBase-root": { padding: 0 } }}
        onPaste={handlePaste}
        inputRef={descriptionRef}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Box mt={1}>
          <ExternalLink
            href={`${customization.APP_BASE_URL}/help/CommonmarkCheatsheet`}
            label="CommonMark Formatting Help"
          >
            <Stack
              flexDirection="row"
              gap={0.5}
              alignItems="center"
              justifyContent={"center"}
            >
              <FaMarkdown />
              <Typography
                fontSize="0.875rem"
                component="span"
              >
                CommonMark Formatting Help
              </Typography>
            </Stack>
          </ExternalLink>
        </Box>
        <Stack
          direction="row"
          gap={1}
          mt={0.5}
        >
          <Button
            variant="outlined"
            disabled={isEditing}
            onClick={() => setShowEmbedImageDialog(true)}
          >
            Embed Image
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowHtmlPreview(true)}
          >
            Preview
          </Button>
        </Stack>
      </Stack>
      <Stack mt={2}>
        <RenderedAttachmentsContainer
          hasAttachments={attachments && attachments.length > 0}
        >
          <DroppableFileUploadInput
            id="attachments-upload"
            dragLabel="Drag Here"
            browseLabel="Choose File(s)"
            multiple
            onFileChanged={onFileChanged}
            maxFileSizeMb={maxFileSizeMb}
            maxRequestSizeMb={maxRequestSizeMb}
            disabled={isEditing}
          />
          {parsedAttachments?.map((attachment, index) => {
            return (
              <Attachment
                key={index}
                attachment={attachment}
                removeAttachment={() => onAttachmentRemoved(attachment, index)}
                disabled={isEditing}
              />
            );
          })}
        </RenderedAttachmentsContainer>
        {formState?.errors?.attachments ? (
          <Alert severity="error">
            {formState?.errors?.attachments?.root.message}
          </Alert>
        ) : null}
      </Stack>
      {unsupportedFiles.length > 0 && (
        <UnsupportedAlert state={unsupportedState} />
      )}
      <EmbedImageDialog
        showEmbedImageDialog={showEmbedImageDialog}
        setShowEmbedImageDialog={setShowEmbedImageDialog}
        addEmbeddedImage={addEmbeddedImage}
        initialImage={initialImage}
        setInitialImage={setInitialImage}
        maxFileSizeMb={maxFileSizeMb}
      />
      {showHtmlPreview && (
        <HtmlPreviewModal
          showHtmlPreview={showHtmlPreview}
          setShowHtmlPreview={setShowHtmlPreview}
          commonmarkSrc={getValues("description")}
          useRemoteAttachments={isEditing}
          attachedFiles={attachments ?? []}
        />
      )}
    </Stack>
  );
};

export default Description;
