import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    viewportHeight: 660,
    viewportWidth: 1000,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});