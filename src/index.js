import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/App';
import { store } from './stores';
import { Provider } from 'react-redux';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import theme, { styledComponentsTheme } from 'config/theme';
import GlobalStyle from 'config/GlobalStyle';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <Provider store={store} >
        <ThemeProvider theme={theme} >
            <StyledComponentsThemeProvider theme={styledComponentsTheme}>
                <GlobalStyle />
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </StyledComponentsThemeProvider>
        </ThemeProvider>
    </Provider>
);
