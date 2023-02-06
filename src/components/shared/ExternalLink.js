import styled from "styled-components";

const StyledExternalLink = styled.a`
    display: flex;
    gap: 0.25rem;
    align-items: center;

    &, & > * {
        color: ${({theme}) => theme.colors.primary} !important;
        font-style: italic;
        text-decoration: underline;
    }
`

const ExternalLink = ({href, children}) => {
    return <StyledExternalLink href={href} rel="noopener noreferrer" target='_blank' >{children}</StyledExternalLink>
}

export default ExternalLink;