import React from "react";
import { EntryEditor } from "./EntryEditor";
import { MemoryRouter } from "react-router-dom";

describe("Entry Editor", () => {
    
    it("invalid log entries are forbidden", () => {

        // Given logbooks to select
        const logbooks = [
            {name: "foo", owner: null, state: "Active"},
            {name: "bar", owner: null, state: "Active"},
            {name: "baz", owner: null, state: "Active"}
        ];
        const logbookError = /error: select at least one logbook/i;
        const titleError = /please specify a title/i;

        cy.mount(
            <MemoryRouter>
                <EntryEditor userData={{username: "foo"}} logbooks={logbooks} />
            </MemoryRouter> 
        );

        // If user tries to submit a logbook without entering any information
        cy.findByRole("button", {name: /submit/i}).click();
    
        // Then the title and logbooks fields have errors
        cy.findByText(logbookError).should("exist");
        cy.findByText(titleError).should("exist");
    
        // If the user puts information in those fields
        cy.findByLabelText(/logbooks/i).type('bar{downArrow}{enter}');
        cy.findByRole('textbox', {name: /title/i}).type("some title");
    
        cy.findByText(logbookError).should("not.exist");
        cy.findByText(titleError).should("not.exist");

    })
    
})