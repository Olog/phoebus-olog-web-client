import { theme } from "beta/config/theme"
import { MuiThemeProvider } from "providers"

export const ThemeProvider = ({children}) => {

    return (
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    )
    
};