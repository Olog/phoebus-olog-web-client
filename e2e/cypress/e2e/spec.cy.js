import {v4 as uuidv4} from 'uuid';


describe('login and create a log entry', () => {

  before(() => {
    cy.task('db:seed');
  })

  it('passes', () => {

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