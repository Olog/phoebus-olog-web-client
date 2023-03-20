const { defineConfig } = require("cypress");
const {seedDatabase} = require('./db');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async 'db:seed'() {
          return seedDatabase();
        }
      })
    },
  },
});
