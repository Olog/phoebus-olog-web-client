import React from "react";
import { MuiThemeProvider, StyledComponentsThemeProvider } from "../src/providers"

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
          <Story />
        </MuiThemeProvider>
      </StyledComponentsThemeProvider>
    )
  ]
};

export default preview;
