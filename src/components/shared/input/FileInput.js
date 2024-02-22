import { useRef, useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import CloudOffIcon from '@mui/icons-material/CloudOff';

const StyledDroppableFileUploadArea = styled("div")`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 5px dashed #ddd;
    border-radius: 20px;
    padding: 1rem;
    color: ${({theme, disabled}) => disabled ? theme.palette.grey[400] : theme.palette.grey[600]};

    &.dragging-over {
        border-color: #777;
        background-color: rgba(0,0,0,0.10);
    }

    &:hover {
        cursor: ${({disabled}) => disabled ? "not-allowed" : "pointer"};
    }

    & input {
        color: transparent;
    }

`

const StyledClickableArea = styled("div")`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`

export const DroppableFileUploadInput = ({id, onFileChanged, className, multiple, accept, dragLabel, browseLabel, maxFileSizeMb, disabled}) => {

    const fileInputRef = useRef();
    const [error, setError] = useState("");

    // Validates the filesize (if applicable)
    // And invokes the filechange callback if valid
    const internalOnFileChanged = (files) => {
        setError(null);
        if(maxFileSizeMb) {
            for(const file of files) {
                if(file.size > maxFileSizeMb*1000000) {
                    fileInputRef.current.value = null;
                    setError(`${file.name} too large; max is ${maxFileSizeMb}MB`)
                    return;
                }
            }
        }
        onFileChanged(files);
    }

    const onChange = (event) => {
        event.preventDefault();
        internalOnFileChanged(event.target.files);
    }

    const onClick = (event) => {
        event.preventDefault(); // event bubbling can cause a page refresh in some components
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }

    const dragAreaRef = useRef();

    const handleDragEnter = (event) => {
        event.preventDefault();
        if(disabled) {
            return;
        }
        dragAreaRef.current.classList.add('dragging-over')
    }

    const handleDragLeave = (event) => {
        event.preventDefault();
        dragAreaRef.current.classList.remove('dragging-over')
    }

    const handleDrop = (event) => {
        event.preventDefault();
        if(disabled) {
            return;
        }
        const dataTransfer = event.dataTransfer;
        internalOnFileChanged(dataTransfer.files);
        dragAreaRef.current.classList.remove('dragging-over')
    }

    return (
        <StyledDroppableFileUploadArea 
            ref={dragAreaRef}
            onDrop={handleDrop} 
            onDragEnter={handleDragEnter} 
            onDragOver={handleDragEnter} 
            onDragLeave={handleDragLeave}
            className={className}
            disabled={disabled}
        >
            <StyledClickableArea onClick={onClick}>
                {/* <MdFileUpload size={'5rem'}/> */}
                <Box fontSize="5rem">
                    {disabled ? <CloudOffIcon fontSize="inherit" /> : <BackupIcon fontSize="inherit"/> }
                </Box>
                <Typography component="label" htmlFor={id} >
                    {disabled ?
                        "File Upload Disabled"
                        : <>{browseLabel}{" "}<Typography component="span" fontWeight="bold">{dragLabel}</Typography></> }
                </Typography>

            </StyledClickableArea>
            <input
                id={id}
                type='file'
                ref={fileInputRef}
                onChange={onChange} 
                multiple={multiple}
                accept={accept}
                hidden
                disabled={disabled}
            />
            {error ? <Typography variant="body2" fontStyle="italic" color="error">{error}</Typography> : null}
        </StyledDroppableFileUploadArea>
    )
}

export default DroppableFileUploadInput;