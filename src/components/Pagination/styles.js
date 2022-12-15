import styled from "styled-components";
import { buttonBaseStyle } from "../common/Button";

export const StyledPaginationButton = styled.a`
    ${buttonBaseStyle}
    color: ${({theme}) => theme.colors.primary};
    background-color: ${({theme}) => theme.colors.lightest};
    text-decoration: none;
    width: min-content;
    padding: 0.5rem 1rem;
    &:visited {
        text-decoration: none;
        color: inherit;
    }

    ${({active, theme}) => active ? 
    `
        background-color: ${theme.colors.primary};
        color: ${theme.colors.lightest};

        &:hover {

        }
    `: `
        &:hover {
            background-color: ${theme.colors.light};
            filter: none;
        }
    `}
`