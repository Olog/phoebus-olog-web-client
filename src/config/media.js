import { css } from "styled-components";

const size = {
    desktop: '2560px',
    mobile: '480px'
}

export const desktop = (content) => css`
    @media(max-width: ${size.desktop}) {
        ${content}
    }
`

export const mobile = (content) => css`
    @media(max-width: ${size.mobile}) {
        ${content}
    }
`