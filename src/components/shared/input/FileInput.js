import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import Button from "components/shared/Button";
import { MdFileUpload } from "react-icons/md";

const Container = styled.div`

`

const ButtonContent = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`
const FileInput = ({label, onFileChanged, multiple, accept}) => {

    const fileInputRef = useRef();

    const onChange = (event) => {
        event.preventDefault();
        onFileChanged(event.target.files);
    }

    const onClick = (event) => {
        event.preventDefault(); // event bubbling can cause a page refresh in some components
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }

    return (
        <Container>
            <Button variant="secondary" size="sm" onClick={onClick}>
                <ButtonContent>
                    <FaPlus className="add-button"/><span>{label}</span>
                </ButtonContent>
            </Button>
            <input
                type='file'
                ref={fileInputRef}
                onChange={onChange} 
                multiple={multiple}
                accept={accept}
                hidden
            />
        </Container>
    );

}

const StyledDroppableFileUploadArea = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 5px dashed #ddd;
    border-radius: 20px;
    padding: 1rem;
    color: #777;

    &.dragging-over {
        border-color: #777;
        background-color: rgba(0,0,0,0.10);
    }

    &:hover {
        cursor: pointer;
    }
`

const StyledClickableArea = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`

export const DroppableFileUploadInput = ({onFileChanged, className, multiple, accept}) => {

    const fileInputRef = useRef();

    const onChange = (event) => {
        event.preventDefault();
        onFileChanged(event.target.files);
    }

    const onClick = (event) => {
        event.preventDefault(); // event bubbling can cause a page refresh in some components
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }

    const dragAreaRef = useRef();

    const handleDragEnter = (event) => {
        console.log('DRAGGING OVER')
        event.preventDefault();
        // event.stopPropagation();
        dragAreaRef.current.classList.add('dragging-over')
    }

    const handleDragLeave = (event) => {
        event.preventDefault();
        // event.stopPropagation();
        dragAreaRef.current.classList.remove('dragging-over')
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const dataTransfer = event.dataTransfer;
        onFileChanged(dataTransfer.files);
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
            
        >
            <StyledClickableArea onClick={onClick}>
                <MdFileUpload size={'5rem'}/>
                <span>Choose a File or <strong>Drag It Here</strong></span>
            </StyledClickableArea>
            <input
                type='file'
                ref={fileInputRef}
                onChange={onChange} 
                multiple={multiple}
                accept={accept}
                hidden
            />
        </StyledDroppableFileUploadArea>
    )
}

export default FileInput;