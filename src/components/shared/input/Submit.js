import styled from "styled-components";

const SubmitButton = styled.input``

const Submit = ({hidden, ...props}) => {
    return (
        <SubmitButton type="submit" hidden={hidden} {...props} />
    )
}

export default Submit;