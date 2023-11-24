import { createTheme } from "@mui/material";
import legacyTheme from "config/theme";

export let theme = createTheme(legacyTheme);


theme = createTheme(theme, {
    palette: {
        primary: theme.palette.essCyan
    }
});
console.log({theme})