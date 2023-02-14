import {v4 as uuidv4} from 'uuid';


describe('Happy Paths', () => {

  before(() => {
    cy.task('db:seed');
  })

  it('Can page through log entries', () => {

    // navigate to the main page
    // NOTE: set CYPRESS_baseUrl to the frontend location!
    cy.visit('/');

    // Perform a search that should return the seed data (Should see 35 results from the seeding <30 seconds ago)
    cy.findByRole('searchbox', {name: /Search/i}).clear().type('start=30 sec{Enter}');

    // Set the page size as expected
    cy.findByRole('textbox', {name: /hits per page/i}).clear().type('30{Enter}');

    // We should see two pages of results
    cy.findByRole('button', {name: /page 1/i}).should('exist');
    cy.findByRole('button', {name: /page 2/i}).should('exist');
    cy.findByRole('button', {name: /page 3/i}).should('not.exist');

    // With entries 6-35 on the first page
    cy.findByRole('heading', {name: /entry #35/i}).should('exist');
    cy.findByRole('heading', {name: /entry #31/i}).should('exist');

    // And entries 1-5 on the second page
    cy.findByRole('button', {name: /page 2/i}).click();
    cy.findByRole('heading', {name: /entry #1/i}).should('exist');
    cy.findByRole('heading', {name: /entry #5/i}).should('exist');

  })

  it('Can login and create a log entry', () => {

    const title = 'title ' + uuidv4();

    // navigate to the main page
    // NOTE: set CYPRESS_baseUrl to the frontend location!
    cy.visit('/');

    // login
    cy.findByRole('button', {name: /sign in/i}).click()
    cy.findByRole('textbox', {name: /username/i}).type('admin')
    cy.findByLabelText(/password/i).type('adminPass');
    cy.findByRole('button', {name: /login/i}).click();

    // create and submit a new log entry
    cy.findByRole('button', {name: /new log entry/i}).click();
    cy.findByLabelText(/logbooks/i).type('control{downArrow}{enter}');
    cy.findByRole('textbox', {name: /title/i}).type(title);
    cy.findByRole('textbox', {name: /description/i}).type('my custom description');
    cy.get('input[type=file]').selectFile('cypress/fixtures/testImage.jpg', {force: true});
    cy.findByRole('button', {name: /submit/i}).click();
    cy.findByRole('heading', {name: title, level: 3 }).click();
    cy.findByRole('button', {name: /attachments/i}).click();
    cy.findByRole('img', {name: /testImage/i});

  })

  
})