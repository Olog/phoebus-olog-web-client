import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/App.js';
import { store } from './store.js';
import { Provider } from 'react-redux';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal';

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
`;

const theme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        danger: '#EE3A3A',
        darkest: '#000',
        dark: '#333',
        neutral: '#777',
        light: '#ddd',
        lightest: '#fff'
    }
};

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <Provider store={store} >
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ModalProvider>
                <App />
            </ModalProvider>
        </ThemeProvider>
    </Provider>
);
