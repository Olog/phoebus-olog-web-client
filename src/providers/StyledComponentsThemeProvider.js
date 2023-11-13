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
import { styledComponentsTheme } from "config/theme";
import { ThemeProvider } from "styled-components";

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
    *:focus-visible {
        outline: 3px solid #006FE6;
        outline-offset: 1px;
        z-index: 9999;
    }
`;

const StyledComponentsThemeProvider = ({children, ...props}) => {

    return (
        <ThemeProvider theme={styledComponentsTheme} {...props}>
                <GlobalStyle />
                {children}
        </ThemeProvider>
    )
}

export default StyledComponentsThemeProvider;