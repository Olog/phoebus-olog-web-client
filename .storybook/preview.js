import React from "react";
import { MuiThemeProvider, ReduxProvider } from "../src/providers";
import { initialize, mswLoader } from 'msw-storybook-addon';
import {defaultHandlers} from "../src/mocks/handlers";

// Initialize MSW
initialize({}, defaultHandlers);

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
      <MuiThemeProvider>
        <ReduxProvider>  
          <Story />
        </ReduxProvider>
      </MuiThemeProvider>
    )
  ],
  loaders: [mswLoader]
};

export default preview;
