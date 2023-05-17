import React from "react";
import theme from 'config/theme';
import GlobalStyle from 'config/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { ModalProvider } from "styled-react-modal";

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
      <ModalProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Story />
        </ThemeProvider>
      </ModalProvider>
    )
  ]
};

export default preview;
