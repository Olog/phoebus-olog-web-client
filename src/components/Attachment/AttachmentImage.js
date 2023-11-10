import { Stack, styled } from "@mui/material";
import React from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const isLocalFile = (attachment) => {
    return Boolean(attachment?.file);
}

export const isImage = (attachment) => {
    if(attachment.file) {
        return attachment?.file?.type?.toLowerCase()?.startsWith("image");
    } else {
        return attachment.fileMetadataDescription === "image";
    }
} 

const FileImage = ({alt, className, ...props}) => {
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

export const LocalImage = styled(({attachment, className, ...props}) => {
    const alt = attachment.file.name;
    if(isImage(attachment)) {
        return (
            <img 
                src={URL.createObjectURL(attachment.file)} 
                alt={alt} 
                className={className} 
                {...props} 
            />
        );
    } else {
        return (
            <FileImage {...{alt, className, ...props}} />
        );
    }
})({});

export const RemoteImage = styled(({attachment, className, ...props}) => {
    const alt = attachment?.filename ?? "unknown image";
    if(isImage(attachment)) {
        return (
            <img 
                src={`${process.env.REACT_APP_BASE_URL}/attachment/` + attachment.id} 
                alt={alt}
                className={className}
                {...props}
            />
        )
    } else {
        return <FileImage {...{alt, className, ...props}} />
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