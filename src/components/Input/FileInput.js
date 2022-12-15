import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import Button from "components/common/Button";

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

export default FileInput;