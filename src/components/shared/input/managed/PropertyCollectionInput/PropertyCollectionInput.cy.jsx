/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

import { useForm } from "react-hook-form";
import { Button, Stack } from "@mui/material";
import PropertyCollectionInput from "./PropertyCollectionInput";

const Fixture = ({ defaultValues }) => {
  const { control, handleSubmit } = useForm({
    defaultValues
  });

  const onSubmit = async (data) => {
    await fetch("/property-test", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PropertyCollectionInput control={control} />
      <Button
        variant="contained"
        type="submit"
      >
        Submit
      </Button>
    </Stack>
  );
};

const emptyProperty = {
  name: null,
  owner: null,
  state: "Active",
  attributes: []
};

const emptyAttribute = {
  name: null,
  value: null,
  state: "Active"
};

const properties = [
  {
    ...emptyProperty,
    name: "resource",
    attributes: [
      { ...emptyAttribute, name: "file" },
      { ...emptyAttribute, name: "name" }
    ]
  },
  {
    ...emptyProperty,
    name: "contact",
    attributes: [
      { ...emptyAttribute, name: "phone" },
      { ...emptyAttribute, name: "email" },
      { ...emptyAttribute, name: "full name" }
    ]
  },
  {
    ...emptyProperty,
    name: "Log Entry Group",
    attributes: [{ ...emptyAttribute, name: "id" }]
  }
];

const existingLogEntryGroup = {
  ...emptyProperty,
  name: "Log Entry Group",
  attributes: [{ ...emptyAttribute, name: "id", value: "someid" }]
};

describe("Property Input", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/properties", (req) =>
      req.reply({
        statusCode: 200,
        body: properties
      })
    ).as("properties");
    cy.intercept("POST", "/property-test", (req) =>
      req.reply({ statusCode: 200 })
    ).as("property-test");
  });

  it("Doesn't include log groups as a property", () => {
    cy.mount(<Fixture />);
    cy.wait("@properties");

    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add log entry group/i }).should(
      "not.exist"
    );
  });

  it("Doesn't mangle data if the properties includes a log group", () => {
    const existing = {
      properties: [
        existingLogEntryGroup,
        {
          ...emptyProperty,
          name: "resource",
          attributes: [
            { ...emptyAttribute, name: "file", value: "some file" },
            { ...emptyAttribute, name: "name", value: "some other name" }
          ]
        }
      ]
    };

    cy.mount(<Fixture defaultValues={existing} />);
    cy.wait("@properties");

    // As-is, the values should match if submitted
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", existing);

    // Remove visible property should work
    cy.findByRole("button", { name: /remove property resource/i }).click();
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [existingLogEntryGroup]
      });

    // add empty property
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).click();
    cy.findByRole("button", { name: /close/i }).click();
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [
          existingLogEntryGroup,
          {
            ...emptyProperty,
            name: "resource",
            attributes: [
              { ...emptyAttribute, name: "file", value: null },
              { ...emptyAttribute, name: "name", value: null }
            ]
          }
        ]
      });

    // Add values
    cy.findByRole("textbox", { name: "file" }).type("some file");
    cy.findByRole("textbox", { name: "name" }).type("some name");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [
          existingLogEntryGroup,
          {
            ...emptyProperty,
            name: "resource",
            attributes: [
              { ...emptyAttribute, name: "file", value: "some file" },
              { ...emptyAttribute, name: "name", value: "some name" }
            ]
          }
        ]
      });
  });

  it("Can add and remove properties", () => {
    cy.mount(
      <Fixture defaultValues={{ properties: [existingLogEntryGroup] }} />
    );
    cy.wait("@properties");

    cy.findByRole("button", { name: /add property/i }).click();

    // All properties should exist
    cy.findByRole("button", { name: /add resource/i }).should("exist");
    cy.findByRole("button", { name: /add contact/i }).should("exist");
    cy.findByRole("button", { name: /close/i }).should("exist");

    // When clicking one, it should disappear

    cy.findByRole("button", { name: /add resource/i })
      .click()
      .should("not.exist");

    cy.findByRole("button", { name: /add contact/i })
      .click()
      .should("not.exist");

    // And when all are clicked then the modal disappears and add property button is disabled
    cy.findByRole("button", { name: /close/i }).should("not.exist");
    cy.findByRole("button", { name: /add property/i }).should("be.disabled");

    // And if we remove properties from the form then they disappear from the form and become available to select
    cy.findByRole("button", { name: /remove property resource/i }).click();
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).should("exist");
    cy.findByRole("button", { name: /add contact/i }).should("not.exist");
    cy.findByRole("button", { name: /close/i }).click();

    cy.findByRole("button", { name: /remove property contact/i }).click();
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).should("exist");
    cy.findByRole("button", { name: /add contact/i }).should("exist");
    cy.findByRole("button", { name: /close/i }).click();

    // And after all that, what we submit should be empty
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", { properties: [existingLogEntryGroup] });
  });

  it("can submit property values", () => {
    cy.mount(
      <Fixture defaultValues={{ properties: [existingLogEntryGroup] }} />
    );
    cy.wait("@properties");

    // Add the resource property
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).click();
    cy.findByRole("button", { name: /close/i }).click();

    // fill out and submit resource property
    cy.findByRole("textbox", { name: "file" }).type("some file");
    cy.findByRole("textbox", { name: "name" }).type("some name");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [
          existingLogEntryGroup,
          {
            ...emptyProperty,
            name: "resource",
            attributes: [
              { ...emptyAttribute, name: "file", value: "some file" },
              { ...emptyAttribute, name: "name", value: "some name" }
            ]
          }
        ]
      });

    // Change the values

    cy.findByRole("textbox", { name: "name" }).clear().type("some other name");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [
          existingLogEntryGroup,
          {
            ...emptyProperty,
            name: "resource",
            attributes: [
              { ...emptyAttribute, name: "file", value: "some file" },
              { ...emptyAttribute, name: "name", value: "some other name" }
            ]
          }
        ]
      });

    // Add the contact property
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add contact/i }).click();
    cy.findByRole("button", { name: /close/i }).click();

    // fill out and submit contact property
    cy.findByRole("textbox", { name: "full name" }).type("Bill Nye");
    cy.findByRole("textbox", { name: "phone" }).type("555 123 4567");
    cy.findByRole("textbox", { name: "email" }).type("bill.nye@pbs.tv");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [
          existingLogEntryGroup,
          {
            ...emptyProperty,
            name: "resource",
            attributes: [
              { ...emptyAttribute, name: "file", value: "some file" },
              { ...emptyAttribute, name: "name", value: "some other name" }
            ]
          },
          {
            ...emptyProperty,
            name: "contact",
            attributes: [
              { ...emptyAttribute, name: "phone", value: "555 123 4567" },
              { ...emptyAttribute, name: "email", value: "bill.nye@pbs.tv" },
              { ...emptyAttribute, name: "full name", value: "Bill Nye" }
            ]
          }
        ]
      });

    // Change the values

    cy.findByRole("textbox", { name: "email" })
      .clear()
      .type("bill.nye@gmail.com");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [
          existingLogEntryGroup,
          {
            ...emptyProperty,
            name: "resource",
            attributes: [
              { ...emptyAttribute, name: "file", value: "some file" },
              { ...emptyAttribute, name: "name", value: "some other name" }
            ]
          },
          {
            ...emptyProperty,
            name: "contact",
            attributes: [
              { ...emptyAttribute, name: "phone", value: "555 123 4567" },
              { ...emptyAttribute, name: "email", value: "bill.nye@gmail.com" },
              { ...emptyAttribute, name: "full name", value: "Bill Nye" }
            ]
          }
        ]
      });

    // remove properties
    cy.findByRole("button", { name: /remove property resource/i }).click();
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [
          existingLogEntryGroup,
          {
            ...emptyProperty,
            name: "contact",
            attributes: [
              { ...emptyAttribute, name: "phone", value: "555 123 4567" },
              { ...emptyAttribute, name: "email", value: "bill.nye@gmail.com" },
              { ...emptyAttribute, name: "full name", value: "Bill Nye" }
            ]
          }
        ]
      });

    cy.findByRole("button", { name: /remove property contact/i }).click();
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@property-test")
      .its("request.body")
      .should("to.deep.equal", {
        properties: [existingLogEntryGroup]
      });
  });

  it("clears values when property removed and re-added", () => {
    cy.mount(
      <Fixture defaultValues={{ properties: [existingLogEntryGroup] }} />
    );
    cy.wait("@properties");

    // Add the resource property
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).click();
    cy.findByRole("button", { name: /close/i }).click();

    // fill out and submit resource property

    cy.findByRole("textbox", { name: "file" })
      .type("some file")
      .should("have.value", "some file");

    cy.findByRole("textbox", { name: "name" })
      .type("some name")
      .should("have.value", "some name");

    // remove and re-add properties
    cy.findByRole("button", { name: /remove property resource/i }).click();
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).click();
    cy.findByRole("button", { name: /close/i }).click();

    // fill out and submit resource property
    cy.findByRole("textbox", { name: "file" }).should("have.value", "");
    cy.findByRole("textbox", { name: "name" }).should("have.value", "");
  });
});
