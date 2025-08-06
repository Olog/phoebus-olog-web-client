import { defineConfig } from "cypress";
import { seedDatabase } from './db.js';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        async 'db:seed'() {
          try {
            console.log('Seeding the database...');
            await seedDatabase();
            console.log('Database seeding completed.');
            return null; // Return null if no specific value is needed
          } catch (error) {
            console.error('Database seeding failed:', error);
            throw error; // Rethrow the error to fail the task
          }
        }
      });
    },
  },
});