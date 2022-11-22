import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.js';
import { store } from './store.js';
import { Provider } from 'react-redux';
// import './css/olog.css';
// import './css/bootstrap.css';
import { createGlobalStyle } from 'styled-components';

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

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <Provider store={store} >
        <GlobalStyle />
        <App />
    </Provider>
);
