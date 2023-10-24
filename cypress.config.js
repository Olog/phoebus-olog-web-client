const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    viewportHeight: 660,
    viewportWidth: 1000,
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
