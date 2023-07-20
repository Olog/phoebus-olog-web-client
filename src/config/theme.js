import { createTheme } from "@mui/material";

export const styledComponentsTheme = {
    colors: {
        primary: '#006FE6',
        secondary: '#6c757d',
        danger: '#EE3A3A',
        warning: '#fff3cd',
        darkest: '#000',
        dark: '#333',
        neutral: '#777',
        light: '#ddd',
        lightest: '#fff'
    }
};

export let theme = createTheme({});

// Compose ESS Colors
theme = createTheme(theme, {
    palette: {
      essCyan: "#0099dc",
      essBlack: "#000000",
      essWhite: "#ffffff",
      essPurple: "#821482",
      essOrange: "#ff7d00",
      essForest: "#006646",
      essGrass: "#99be00",
      essNavy: "#003366",
      legacyBlue: '#006FE6' // to remove
    }
  });

// Compose remaining overrides
theme = createTheme(theme, {
    palette: {
      primary: {
        main: theme.palette.legacyBlue,
        lightText: theme.palette.essWhite
      },
      primaryContrastText: {
        main: theme.palette.primary.contrastText
      },
      status: {
        ok: theme.palette.success.main,
        progress: theme.palette.warning.light,
        fail: theme.palette.error.main
      }
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: "none",
            ":hover": {
              textDecoration: "underline"
            }
          }
        }
      }
    }
  });  

export default theme;