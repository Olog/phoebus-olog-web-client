import styled from "styled-components";

const StyledAnchor = styled.a`
    left: -150%;
    position: absolute;
    font-size: 1.5rem;
    background-color: ${({theme}) => theme.colors.light};
    padding: 0.5rem 1rem;
    z-index: 999;
    text-decoration: underline;

    transition: all 300ms linear;

    &:focus {
        left: 0;
    }
`

const SkipToContent = ({children, ...props}) => {
    return (
        <StyledAnchor tabIndex={0} {...props} >
            {children}
        </StyledAnchor>
    )
}

export default SkipToContent;