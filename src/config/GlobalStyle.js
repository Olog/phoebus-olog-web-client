import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    ol, ul {
        list-style: none;
    }
    a {
        text-decoration: none;
    }
    a:visited {
        color: inherit;
    }

    *:focus-visible {
        outline: 3px solid orange;
        outline-offset: 1px;
        z-index: 9999;
    }
`;

export default GlobalStyle;