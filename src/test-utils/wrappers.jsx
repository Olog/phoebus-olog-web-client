import { MuiThemeProvider, LocalizationProvider, ReduxProvider } from "providers";

export const AppWrapper = ({store, children}) => {
    return (
        <ReduxProvider store={store}>
            <MuiThemeProvider>
                <LocalizationProvider>
                    {children}
                </LocalizationProvider>
            </MuiThemeProvider>
        </ReduxProvider>
    )
};