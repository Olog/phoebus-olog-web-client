import styled from "styled-components";
import ErrorMessage from "./ErrorMessage";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 0.5rem;
    padding-bottom: 1rem;

    & label {
        padding-bottom: 0.2rem;
    }

    & span {
        padding-top: 0.2rem;
    }
`

const LabeledInput = ({name, label, error, children}) => {

    return (
        <Container>
            <label htmlFor={name}>{label}</label>
            {children}
            <ErrorMessage error={error} />
        </Container>
    )
};

export default LabeledInput;