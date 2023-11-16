import { Alert, Box, Button, FormLabel, Grid, Stack, Typography, styled } from "@mui/material";
import ologAxiosApi from "api/axios-olog-service";
import DroppableFileUploadInput from "components/shared/input/FileInput";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import customization from "config/customization";
import OlogAttachment from "./OlogAttachment";
import { v4 as uuidv4 } from 'uuid';
import Attachment from "components/Attachment/Attachment";
import TextInput from "components/shared/input/TextInput";
import { ExternalLink } from "components/shared/ExternalLink";
import { FaMarkdown } from "react-icons/fa";
import EmbedImageDialog from "./EmbedImageDialog";
import HtmlPreviewModal from "./HtmlPreviewModal";
import removeImageMarkup from "./removeImageMarkup";

const RenderedAttachmentsContainer = styled("div")(({hasAttachments, theme}) => ({
    display: hasAttachments ? "grid" : "flex",
    placeItems: "center",
    gridTemplateColumns: "repeat(auto-fill, 10rem)",
    gridTemplateRows: "repeat(auto-fill, 10rem)",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
    border: `solid 1px ${theme.palette.gray}`,
    borderRadius: "5px"
}));

const Description = ({form, attachmentsDisabled }) => {

    const {control, formState, getValues, setValue } = form;
    
    const [maxRequestSizeMb, setMaxRequestSizeMb] = useState(customization.defaultMaxRequestSizeMb);
    const [maxFileSizeMb, setMaxFileSizeMb] = useState(customization.defaultMaxFileSizeMb);
    const [initialImage, setInitialImage] = useState(null);
    const [showEmbedImageDialog, setShowEmbedImageDialog] = useState(false);
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);

    const { fields: attachments, remove: removeAttachment, append: appendAttachment } = useFieldArray({
        control,
        name: 'attachments',
        keyName: 'reactHookFormId', // default is 'id', which would override OlogAttachment#id
        rules: {
            validate: {
                maxRequestSize: (attachments) => {
                    const total = attachments.map(it => it?.file?.size || 0).reduce((prev, curr) => curr + prev, 0);
                    const max = maxRequestSizeMb*1000000;
                    return total < max || `Attachments exceed total maximum upload size of ${maxRequestSizeMb}MB` 
                },
                maxFileSize: (attachments) => {
                    const max = maxFileSizeMb*1000000;
                    const results = attachments.filter(it => it?.file?.size > max).map(it => it?.file?.name);
                    return results.length === 0 || `Attachments exceed max filesize (${maxFileSizeMb}MB): ${results}`
                }
            }
        }
    })

    /**
     * Appends an attachment object to the attachments form field
     * @param {*} event 
     */
    const onFileChanged = (files) => {
        if(files) {
            // note event.target.files is a FileList, not an array! But we can convert it
            Array.from(files).forEach(file => {
                appendAttachment(new OlogAttachment(file, uuidv4()));
            });
        }
    }

    /**
     * When an attachment is removed, update the internal state
     * and also remove any embeds found in the description
     */
    const onAttachmentRemoved = (attachment, index) => {
        
        let description = getValues('description') || '';
        if(description.indexOf(attachment.id) > -1){  // Find potential markup referencing the attachment
            let updatedDescription = removeImageMarkup(description, attachment.id);
            setValue('description', updatedDescription);
        }
        removeAttachment(index);
    }

    const handlePaste = (e) => {
        if(attachmentsDisabled) {
            return;
        }
        const items = e.clipboardData.items;
        let imageFile = null;
        for(let item of items) {
            if(item.kind === 'file' && item.type.match(/^image/)) {
                imageFile = item.getAsFile();
            }
        }
        if(imageFile) {
            setInitialImage(imageFile);
            setShowEmbedImageDialog(true);
            // prevent paste of image 'text'
            e.preventDefault();
        }
    }

    /**
     * Inserts image markup into the description field
     * @param {*} file 
     * @param {*} width 
     * @param {*} height 
     */
    const addEmbeddedImage = (file, width, height) => {
        const id = uuidv4();
        appendAttachment(new OlogAttachment(file, id));
        const imageMarkup = "![](attachment/" + id + "){width=" + width + " height=" + height + "}";
        let description = getValues('description') || '';
        description += imageMarkup;
        setValue('description', description, {shouldDirty: false, shouldTouch: false, shouldValidate: false});
    }

    // Get the max attachment filesize 
    useEffect(() => {
        ologAxiosApi.get('/')
            .then(res => {
                const {data} = res;
                setMaxRequestSizeMb(data?.serverConfig?.maxRequestSize || customization.defaultMaxRequestSizeMb);
                setMaxFileSizeMb(data?.serverConfig?.maxFileSize || customization.defaultMaxFileSizeMb);
            })
            .catch(() => {
                setMaxRequestSizeMb(customization.defaultMaxRequestSizeMb);
                setMaxFileSizeMb(customization.defaultMaxFileSizeMb);
            })
    }, []);
    

    /**
     * If attachments are present, creates a wrapper containing an array of Attachment components
     */
    const renderedAttachments = attachments.map((attachment, index) => {
        return  <Attachment 
                    key={index} 
                    attachment={attachment} 
                    removeAttachment={() => onAttachmentRemoved(attachment, index)}
                    disabled={attachmentsDisabled}
                />
    });

    return (
        <Stack gap={1}>
            <TextInput 
                name='description'
                label='Description'
                control={control}
                defaultValue=''
                multiline
                minRows={10}
                onPaste={handlePaste}
            />
            <Stack direction="row" justifyContent="space-between">
                <Box>
                    <ExternalLink href={`${customization.APP_BASE_URL}/help/CommonmarkCheatsheet`} 
                        text={
                            <Stack flexDirection="row" gap={0.5} alignItems="center">
                                <FaMarkdown />
                                <Typography component="span">
                                    CommonMark Formatting Help
                                </Typography>
                            </Stack>
                        }
                        label="CommonMark Formatting Help"
                    />
                </Box>
                <Stack direction="row" gap={1}>
                    <Button variant="outlined" disabled={attachmentsDisabled} onClick={() => setShowEmbedImageDialog(true) } >
                        Embed Image
                    </Button>
                    <Button variant="outlined" onClick={(e) => setShowHtmlPreview(true) } >
                        Preview
                    </Button>
                </Stack>
            </Stack>
            <Stack>
                <FormLabel htmlFor="attachments-upload">{!attachmentsDisabled ? "Attachments" : "Attachments (Disabled)"}</FormLabel>
                {!attachmentsDisabled ? <Typography>max size per file: {maxFileSizeMb}MB, max total size: {maxRequestSizeMb}MB</Typography> : null}
                <Stack>
                    <Grid>
                    <RenderedAttachmentsContainer hasAttachments={attachments && attachments.length > 0}>
                        <DroppableFileUploadInput 
                            onFileChanged={onFileChanged}
                            id='attachments-upload'
                            dragLabel='Drag Here'
                            browseLabel='Choose File(s) or'
                            multiple
                            maxFileSizeMb={maxFileSizeMb}
                            disabled={attachmentsDisabled}
                        />
                        { renderedAttachments }
                    </RenderedAttachmentsContainer>
                    </Grid>
                    { formState?.errors?.attachments ? 
                        <Alert severity="error">{formState?.errors?.attachments?.root.message}</Alert>
                        : null 
                    } 
                </Stack>
            </Stack>
            <EmbedImageDialog showEmbedImageDialog={showEmbedImageDialog} 
                setShowEmbedImageDialog={setShowEmbedImageDialog}
                addEmbeddedImage={addEmbeddedImage}
                initialImage={initialImage}
                setInitialImage={setInitialImage}
                maxFileSizeMb={maxFileSizeMb}
            />
            <HtmlPreviewModal 
                showHtmlPreview={showHtmlPreview}
                setShowHtmlPreview={setShowHtmlPreview}
                commonmarkSrc={getValues('description')}
                attachedFiles={attachments}
            />
        </Stack>
    );
}

export default Description;