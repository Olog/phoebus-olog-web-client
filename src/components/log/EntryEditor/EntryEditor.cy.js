/* eslint-disable no-console */
import React from "react";
import { EntryEditor } from "./EntryEditor";
import { useForm } from "react-hook-form";

const Template = (props) => {
  const form = useForm({
    defaultValues: {
      attachments: []
    }
  });

  const onSubmit = (data) => {
    console.log({ data });
  };

  const submitDisabled = false;

  return (
    <EntryEditor
      {...{ form, title: "Test Entry Editor", onSubmit, submitDisabled }}
    />
  );
};

describe("Entry Editor", () => {
  it("invalid log entries are forbidden", () => {
    // Given logbooks to select
    cy.intercept("GET", "**/logbooks", {
      statusCode: 200,
      body: [
        { name: "foo", owner: null, state: "Active" },
        { name: "bar", owner: null, state: "Active" },
        { name: "baz", owner: null, state: "Active" }
      ]
    });

    const logbookError = /error: select at least one logbook/i;
    const titleError = /please specify a title/i;

    cy.mount(<Template />);

    // If user tries to submit a logbook without entering any information
    cy.findByRole("button", { name: /submit/i }).click();

    // Then the title and logbooks fields have errors
    cy.findByText(logbookError).should("exist");
    cy.findByText(titleError).should("exist");

    // If the user puts information in those fields
    cy.findByLabelText(/logbooks/i).type("bar{downArrow}{enter}");
    cy.findByRole("textbox", { name: /title/i }).type("some title");

    cy.findByText(logbookError).should("not.exist");
    cy.findByText(titleError).should("not.exist");
  });
});
