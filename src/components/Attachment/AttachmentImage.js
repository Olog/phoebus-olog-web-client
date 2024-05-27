import { Stack, styled } from "@mui/material";
import React from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import customization from "config/customization";

export const isLocalFile = (attachment) => {
    return Boolean(attachment?.file);
}

export const isImage = (attachment) => {
    if(attachment.file) {
        return attachment?.file?.type?.toLowerCase()?.startsWith("image");
    } else {
        return attachment.fileMetadataDescription?.toLowerCase()?.startsWith("image");
    }
} 

export const FileImage = ({alt, className, ...props}) => {
    return (
        <Stack 
            fontSize="5rem"
            color="gray"
            justifyContent="center"
            alignItems="center"
            className={className} 
            {...props} 
        >
            <InsertDriveFileIcon titleAccess={"file: " + alt} fontSize="inherit" />
        </Stack>
    )
}

export const LocalImage = styled(({attachment, className, ImageProps, FileProps}) => {
    const alt = attachment.file.name;
    if(isImage(attachment)) {
        return (
            <img 
                src={URL.createObjectURL(attachment.file)} 
                alt={alt} 
                className={className} 
                {...ImageProps} 
            />
        );
    } else {
        return (
            <FileImage {...{alt, className, ...FileProps}} />
        );
    }
})({});

export const RemoteImage = styled(({attachment, className, ImageProps, FileProps}) => {
    const alt = attachment?.filename ?? "unknown image";
    if(isImage(attachment)) {
        return (
            <img 
                src={`${customization.APP_BASE_URL}/attachment/` + attachment.id} 
                alt={alt}
                className={className}
                {...ImageProps}
            />
        )
    } else {
        return <FileImage {...{alt, className, ...FileProps}} />
    }
})({});

const AttachmentImage = styled(({attachment, className, ...props}) => {

    if(isLocalFile(attachment)) {
        return <LocalImage {...{attachment, className, ...props}} />
    } else {
        return <RemoteImage {...{attachment, className, ...props}} />
    }

})({});

export default AttachmentImage;