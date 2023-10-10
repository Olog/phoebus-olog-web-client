import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/App';
import { store } from './stores';
import { Provider } from 'react-redux';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import theme, { styledComponentsTheme } from 'config/theme';
import GlobalStyle from 'config/GlobalStyle';
import { BrowserRouter } from 'react-router-dom';
/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

import { ThemeProvider } from '@mui/material';
import LocalizationProvider from 'config/LocalizationProvider';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <Provider store={store} >
        <ThemeProvider theme={theme} >
            <StyledComponentsThemeProvider theme={styledComponentsTheme}>
                <GlobalStyle />
                <LocalizationProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </ModalProvider>
                </LocalizationProvider>
            </StyledComponentsThemeProvider>
        </ThemeProvider>
    </Provider>
);
