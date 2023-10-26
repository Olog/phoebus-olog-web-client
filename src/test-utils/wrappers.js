import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import LocalizationProvider from "../config/LocalizationProvider";
import GlobalStyle from "config/GlobalStyle";

export const AppWrapper = ({store, theme, styledComponentsTheme, children}) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <StyledComponentsThemeProvider theme={styledComponentsTheme}>
                    <GlobalStyle />
                    <LocalizationProvider>
                        {children}
                    </LocalizationProvider>
                </StyledComponentsThemeProvider>
            </ThemeProvider>
        </Provider>
    )
};