import styled from "styled-components";
import ErrorMessage from "./ErrorMessage";

const Container = styled.div`
    display: flex;
    flex-direction: ${({inlineLabel}) => inlineLabel ? 'row' : 'column'};    
    padding-bottom: 1rem;
    width: 100%;
    ${({inlineLabel}) => inlineLabel ? `
        align-items: center;
        gap: 0.5rem;
    ` : `
        justify-content: center;
        gap: 0.2rem;
    `}

    & label {
        white-space: nowrap;
    }

    & span {
        padding-top: 0.2rem;
    }

    ${({error, theme}) => error ? `
        margin: 1rem 0;
        padding-left: 1rem;
        border-left: 5px solid ${theme.colors.danger};
    `: ''}
`

const LabeledInput = ({name, label, error, inlineLabel, className, children}) => {

    const LabelContents = error 
    ? <ErrorMessage error={label + " - Error: " + error} />
    : label;

    return (
        <Container {...{inlineLabel, error, className}}>
            <label htmlFor={name}>{LabelContents}</label>
            {children}
        </Container>
    )
};

export default LabeledInput;