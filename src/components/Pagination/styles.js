import styled from "styled-components";
import { buttonBaseStyle } from "components/shared/Button";

export const StyledPagination = styled.nav`
    ul {
        display: flex;
    }
    ul > * {
        border: 1px solid ${({theme}) => theme.colors.neutral};
    }
    ul > *:not(:first-child) {
        border-left: none;
    }
`

export const StyledListItem = styled.li`

    ${({theme}) => `
        [aria-current="true"] {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.lightest};
        }
        &:hover[enabled] {
            background-color: ${theme.colors.light};
            filter: none;
        }
    `}

`

export const StyledPaginationButton = styled.button`

    ${buttonBaseStyle}
    border-radius: 0;
    color: ${({theme}) => theme.colors.primary};
    background-color: ${({theme}) => theme.colors.lightest};
    text-decoration: none;
    width: min-content;
    padding: 0.5rem 1rem;

    &:visited {
        text-decoration: none;
        color: inherit;
    }

    &[disabled] {
        filter: opacity(50%) grayscale(100%);
        cursor: not-allowed;
    }

`