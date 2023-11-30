import React from "react";
import { MuiThemeProvider, ReduxProvider, StyledComponentsThemeProvider } from "../src/providers";
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
initialize();

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
      <StyledComponentsThemeProvider>
        <MuiThemeProvider>
          <ReduxProvider>  
            <Story />
          </ReduxProvider>
        </MuiThemeProvider>
      </StyledComponentsThemeProvider>
    )
  ],
  loaders: [mswLoader]
};

export default preview;
