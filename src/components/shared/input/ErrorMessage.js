import styled from "styled-components"

const Container = styled.span`
    color: ${({theme}) => theme.colors.danger};
    font-style: italic;
`

const ErrorMessage = ({error}) => {
    if(error) {
        return <Container>{error}</Container>;
    } else {
        return null;
    }
}

export default ErrorMessage;