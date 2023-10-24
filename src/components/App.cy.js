import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { resultList, testEntry } from "../mocks/fixtures/generators";

describe('App.cy.js', () => {

  it('can navigate different log entries by clicking on the next/previous buttons on the log entry', () => {

    // Given the server responds with many search results to click on
    cy.intercept(
      'GET',
      '**/logs/search*',
      {
        statusCode: 200,
        body: resultList([
          testEntry({title: 'Entry 1'}),
          testEntry({title: 'Entry 2'}),
          testEntry({title: 'Entry 3'})
        ])
      }
    );

    cy.mount(<MemoryRouter><App /></MemoryRouter>);

    // We can click the header from the result list to open its details
    cy.findByRole('list', {name: /search results/i})
    .within(() => {
      cy.findByRole('heading', {name: 'Entry 1'}).click();
    });

    // Once clicked, the details page is opened (level 2 header)
    // And we can navigate to the next entry but not the previous one
    cy.findByRole('heading', {name: 'Entry 1', level: 2}).should("exist");
    cy.findByRole('button', {name: /previous log entry/i}).should("be.disabled");
    cy.findByRole('button', {name: /next log entry/i}).should("not.be.disabled").click();
    
    // Once viewing the second entry, we can navigate to the previous or next entry
    cy.findByRole('heading', {name: 'Entry 2', level: 2}).should("exist");
    cy.findByRole('button', {name: /previous log entry/i}).should("not.be.disabled");
    cy.findByRole('button', {name: /next log entry/i}).should("not.be.disabled").click();

    // Once viewing the last entry we can navigate to the previous but not last entry
    cy.findByRole('heading', {name: 'Entry 3', level: 2}).should("exist");
    cy.findByRole('button', {name: /previous log entry/i}).should("not.be.disabled");
    cy.findByRole('button', {name: /next log entry/i}).should("be.disabled");

  });

});