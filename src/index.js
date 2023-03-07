import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/App';
import { store } from './stores';
import { Provider } from 'react-redux';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import theme from 'config/theme';
import { BrowserRouter } from 'react-router-dom';

// CSS Reset
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

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <Provider store={store} >
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ModalProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ModalProvider>
        </ThemeProvider>
    </Provider>
);
