import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const LabeledInput = ({name, label, children}) => {

    return (
        <Container>
            <label htmlFor={name}>{label}</label>
            {children}
        </Container>
    )
};

export default LabeledInput;