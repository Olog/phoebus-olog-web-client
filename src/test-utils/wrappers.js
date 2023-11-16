import { MuiThemeProvider, StyledComponentsThemeProvider, LocalizationProvider, ReduxProvider } from "providers";

export const AppWrapper = ({store, children}) => {
    return (
        <ReduxProvider store={store}>
            <MuiThemeProvider>
                <StyledComponentsThemeProvider>
                    <LocalizationProvider>
                        {children}
                    </LocalizationProvider>
                </StyledComponentsThemeProvider>
            </MuiThemeProvider>
        </ReduxProvider>
    )
};