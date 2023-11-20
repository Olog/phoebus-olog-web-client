import React from "react";
import { resultList, testEntry } from "../mocks/fixtures/generators";
import customization from "config/customization";
import { defaultSearchPageParamsState } from "features/searchPageParamsReducer";
import { defaultSearchParamsState } from "features/searchParamsReducer";
import { TestRouteProvider } from "test-utils/router-utils";

describe("App.cy.js", () => {
  it("can navigate different log entries by clicking on the next/previous buttons on the log entry", () => {
    // Given the server responds with many search results to click on
    cy.intercept("GET", "**/logs/search*", {
      statusCode: 200,
      body: resultList([
        testEntry({ title: "Entry 1" }),
        testEntry({ title: "Entry 2" }),
        testEntry({ title: "Entry 3" })
      ])
    });

    cy.mount(<TestRouteProvider />);

    // We can click the header from the result list to open its details
    cy.findByRole("grid", { name: /search results/i }).within(() => {
      cy.findByRole("heading", { name: "Entry 1" }).click();
    });

    // Once clicked, the details page is opened (level 2 header)
    // And we can navigate to the next entry but not the previous one
    cy.findByRole("heading", { name: "Entry 1", level: 2 }).should("exist");
    cy.findByRole("button", { name: /previous log entry/i }).should(
      "be.disabled"
    );
    cy.findByRole("button", { name: /next log entry/i })
      .should("not.be.disabled")
      .click();

    // Once viewing the second entry, we can navigate to the previous or next entry
    cy.findByRole("heading", { name: "Entry 2", level: 2 }).should("exist");
    cy.findByRole("button", { name: /previous log entry/i }).should(
      "not.be.disabled"
    );
    cy.findByRole("button", { name: /next log entry/i })
      .should("not.be.disabled")
      .click();

    // Once viewing the last entry we can navigate to the previous but not last entry
    cy.findByRole("heading", { name: "Entry 3", level: 2 }).should("exist");
    cy.findByRole("button", { name: /previous log entry/i }).should(
      "not.be.disabled"
    );
    cy.findByRole("button", { name: /next log entry/i }).should("be.disabled");
  });

  it("search results sort order is newest-date-first by default, and updates as expected", () => {
    // Given the server will return search results out of order
    // (IMPORTANT: currently the ordering is server-side since there is paging)
    cy.intercept("GET", "**/logs/search*", {
      statusCode: 200,
      body: resultList([
        testEntry({
          title: "log entry 3",
          createdDate: Date.parse("2023-01-31T00:00:03")
        }),
        testEntry({
          title: "log entry 1",
          createdDate: Date.parse("2023-01-31T00:00:01")
        }),
        testEntry({
          title: "log entry 2",
          createdDate: Date.parse("2023-01-31T00:00:02")
        })
      ])
    });

    cy.mount(<TestRouteProvider />);

    // The user will see search results in descending order by default (newest date first)
    const descendingTitles = ["log entry 3", "log entry 2", "log entry 1"];
    cy.findByRole("grid", { name: /Search Results/i }).within(() => {
      cy.findAllByRole("heading", { name: /log entry \d/ }).each(
        (item, index) => {
          cy.wrap(item).should("contain.text", descendingTitles[index]);
        }
      );
    });

    // Update the sort direction
    cy.findByRole("button", { name: /show advanced search/i }).click();
    cy.findByRole("radio", { name: /ascending/i }).click();
    // cy.findByRole('button', {name: /hide advanced search/i}).click();

    // The user will see the search results in ascending order
    const ascendingTitles = ["log entry 1", "log entry 2", "log entry 3"];
    cy.findByRole("grid", { name: /Search Results/i }).within(() => {
      cy.findAllByRole("heading", { name: /log entry \d/ }).each(
        (item, index) => {
          cy.wrap(item).should("contain.text", ascendingTitles[index]);
        }
      );
    });
  });

  it("uses previous cookie state for search params if they exist", () => {
    // Given we set the search params to something that isn't the default value
    expect(defaultSearchPageParamsState.sort).not.equal("up");
    expect(defaultSearchPageParamsState.size).not.equal(50);
    cy.setCookie(
      customization.searchPageParamsCookie,
      JSON.stringify({
        ...defaultSearchPageParamsState,
        sort: "up",
        size: 50
      })
    );
    const title = "my unique title";
    cy.setCookie(
      customization.searchParamsCookie,
      JSON.stringify({
        ...defaultSearchParamsState,
        title
      })
    );

    // Then when the user loads the page
    cy.mount(<TestRouteProvider />);

    // The search bar shows their existing search
    cy.findByRole("searchbox", { name: /search logs/i })
      .invoke("val")
      .should("include", title);

    // page size should be set to cookie value
    cy.findByRole("button", { name: /hits per page 50/i }).should("exist");

    // and sort should be set to cookie value
    cy.findByRole("button", { name: /show advanced search/i }).click();
    cy.findByRole("radio", { name: /ascending/i }).should("be.checked");
  });
});
