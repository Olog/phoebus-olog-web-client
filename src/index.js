import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/App';
import { store } from './stores';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import theme from 'config/theme';
import GlobalStyle from 'config/GlobalStyle';
import { BrowserRouter } from 'react-router-dom';

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
