import React from "react";
import { styledComponentsTheme, theme } from 'config/theme';
import GlobalStyle from 'config/GlobalStyle';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeProvider } from "@mui/material";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <StyledComponentsThemeProvider theme={styledComponentsTheme}>
        <GlobalStyle />
        <ThemeProvider theme={theme} >
          <Story />
        </ThemeProvider>
      </StyledComponentsThemeProvider>
    )
  ]
};

export default preview;
