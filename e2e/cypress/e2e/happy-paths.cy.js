import { v4 as uuidv4 } from "uuid";

let title = "title " + uuidv4();
let property = {
  name: "resource",
  attributes: {
    file: {
      name: "file",
      value: uuidv4()
    },
    name: {
      name: "name",
      value: uuidv4()
    }
  }
};

describe("Happy Paths", () => {
  before(() => {
    cy.task("db:seed");
  });

  after(() => cy.screenshot());

  it("Can page through log entries", () => {
    // navigate to the main page
    // NOTE: set CYPRESS_baseUrl to the frontend location!
    cy.visit("/");

    // Perform a search that should return the seed data (Should see 35 results from the seeding <30 seconds ago)
    // eslint-disable-next-line
    cy.findByRole("searchbox", { name: /Search Logs/i })
      .clear()
      .type("start=1 min{Enter}");

    // Set the page size as expected
    cy.findByRole("button", { name: /hits per page/i }).click();
    cy.findByRole("option", { name: /30/i }).click();

    // Entries 6-35 should appear on the first page with scrolling
    // (datagrid only renders the rows in the viewport, not all of them at once, for better performance)
    cy.findByRole("row", { name: /entry #35/i }).should("exist");
    cy.findByRole("row", { name: /entry #30/i }).scrollIntoView();
    cy.findByRole("row", { name: /entry #25/i }).scrollIntoView();
    cy.findByRole("row", { name: /entry #20/i }).scrollIntoView();
    cy.findByRole("row", { name: /entry #15/i }).scrollIntoView();
    cy.findByRole("row", { name: /entry #10/i }).scrollIntoView();
    // eslint-disable-next-line
    cy.findByRole("row", { name: /entry #6/i })
      .scrollIntoView()
      .should("exist");

    // And entries 1-5 on the second page
    cy.findByRole("button", { name: /next page/ }).click();
    cy.findByRole("row", { name: /entry #1/i }).should("exist");
    cy.findByRole("row", { name: /entry #5/i }).should("exist");

    // And there should be no more pages
    cy.findByRole("button", { name: /next page/ }).should("be.disabled");
  });

  it("Can login and create a log entry", () => {
    // navigate to the main page
    // NOTE: set CYPRESS_baseUrl to the frontend location!
    cy.visit("/");

    // login
    cy.findByRole("button", { name: /sign in/i }).click();
    cy.findByRole("textbox", { name: /username/i }).type("admin");
    cy.findByLabelText(/password/i).type("adminPass");
    cy.findByRole("button", { name: /login/i }).click();

    // create and submit a new log entry
    cy.findByRole("link", { name: /new log entry/i }).click();
    cy.findByLabelText(/logbooks/i).type("e2e-tests{downArrow}{enter}");
    cy.findByLabelText(/tags/i).type("e2e-test-tag{downArrow}{enter}");
    cy.findByLabelText(/entry type/i).type("incident{downArrow}{enter}");
    cy.findByRole("textbox", { name: /title/i }).type(title);
    cy.findByRole("textbox", { name: /description/i }).type(
      "my custom description"
    );
    cy.get("input[type=file]").selectFile("cypress/fixtures/testImage.jpg", {
      force: true
    });

    // Add the resource property
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).click();
    cy.findByRole("button", { name: /close/i }).click();
    cy.findByRole("textbox", { name: "file" }).type(
      property.attributes.file.value,
      { delay: 0 }
    );
    cy.findByRole("textbox", { name: "name" }).type(
      property.attributes.name.value,
      { delay: 0 }
    );

    // submit
    cy.findByRole("button", { name: /submit/i }).click();

    // expect to find the entry we created
    cy.findByRole("heading", { name: title, level: 3, timeout: 10000 }).click(); // increased timeout due to server performance changes
    cy.findByTestId("meta-logbooks")
      .invoke("text")
      .should("match", /e2e-tests/i);
    cy.findByTestId("meta-tags")
      .invoke("text")
      .should("match", /e2e-test-tag/i);
    cy.findByTestId("meta-entrytype")
      .invoke("text")
      .should("match", /incident/i);
    cy.findByRole("button", { name: /attachments/i }).click();
    cy.findByRole("img", { name: /testImage/i }).should("exist");
    cy.findByRole("button", { name: /properties/i }).click();
    cy.findByRole("button", { name: "resource" }).should("exist");
    cy.findByText(property.attributes.file.value).should("exist");
    cy.findByText(property.attributes.name.value).should("exist");
  });

  it("Can reply to an existing log entry", () => {
    // navigate to the main page
    // NOTE: set CYPRESS_baseUrl to the frontend location!
    cy.visit("/");

    // login
    cy.findByRole("button", { name: /sign in/i }).click();
    cy.findByRole("textbox", { name: /username/i }).type("admin");
    cy.findByLabelText(/password/i).type("adminPass");
    cy.findByRole("button", { name: /login/i }).click();

    // find an existing log entry
    cy.findByRole("heading", { name: title, level: 3 }).click();
    cy.findByRole("link", { name: /reply/i }).click();

    // It should be pre-populated with the title, logbooks, tags, and default for entry type
    cy.findByRole("textbox", { name: /title/i }).should("have.value", title);
    cy.findByRole("button", { name: "e2e-tests" }).should("exist");
    cy.findByRole("button", { name: "e2e-test-tag" }).should("exist");
    cy.findByRole("combobox", { name: /entry type/i }).should(
      "have.value",
      "Normal"
    );

    // Update our reply, including adding an attachment
    cy.findByRole("textbox", { name: /title/i }).type(" my reply");
    title += " my reply";
    cy.findByRole("textbox", { name: /description/i }).type("my custom reply");
    cy.findByLabelText(/logbooks/i).type("controls{downArrow}{enter}");
    cy.findByLabelText(/tags/i).type("alarm{downArrow}{enter}");
    cy.findByLabelText(/entry type/i).type("shift start{downArrow}{enter}");
    cy.get("input[type=file]").selectFile("cypress/fixtures/testImage.jpg", {
      force: true
    });

    // Add the resource property
    property.attributes.file.value = uuidv4();
    property.attributes.name.value = uuidv4();
    cy.findByRole("button", { name: /add property/i }).click();
    cy.findByRole("button", { name: /add resource/i }).click();
    cy.findByRole("button", { name: /close/i }).click();
    cy.findByRole("textbox", { name: "file" }).type(
      property.attributes.file.value,
      { delay: 0 }
    );
    cy.findByRole("textbox", { name: "name" }).type(
      property.attributes.name.value,
      { delay: 0 }
    );

    cy.findByRole("button", { name: /submit/i }).click();

    // expect to find the reply we created
    cy.findByRole("heading", { name: title, level: 3, timeout: 10000 }).click(); // increased timeout due to server performance changes
    cy.findByTestId("meta-logbooks")
      .invoke("text")
      .should("match", /controls.*e2e-tests/i);
    cy.findByTestId("meta-tags")
      .invoke("text")
      .should("match", /alarm.*e2e-test-tag/i);
    cy.findByTestId("meta-entrytype")
      .invoke("text")
      .should("match", /shift start/i);
    cy.findByRole("button", { name: /attachments/i }).click();
    cy.findByRole("img", { name: /testImage/i }).should("exist");
    cy.findByRole("button", { name: /properties/i }).click();
    cy.findByRole("button", { name: "resource" }).should("exist");
    cy.findByText(property.attributes.file.value).should("exist");
    cy.findByText(property.attributes.name.value).should("exist");
  });

  it("Can edit an existing log entry", () => {
    // navigate to the main page
    // NOTE: set CYPRESS_baseUrl to the frontend location!
    cy.visit("/");

    // login
    cy.findByRole("button", { name: /sign in/i }).click();
    cy.findByRole("textbox", { name: /username/i }).type("admin");
    cy.findByLabelText(/password/i).type("adminPass");
    cy.findByRole("button", { name: /login/i }).click();

    // find an existing log entry
    cy.findByRole("heading", { name: title, level: 3 }).click();
    cy.findByRole("link", { name: /edit/i }).click();

    // Edit our log
    title += " (EDITED)";
    property.attributes.file.value += " edited";
    property.attributes.name.value += " edited";
    // eslint-disable-next-line
    cy.findByRole("textbox", { name: /title/i }).clear().type(title);
    cy.findByLabelText(/logbooks/i).type("operations{downArrow}{enter}");
    cy.findByRole("button", { name: /alarm/i }).click();
    cy.findByLabelText(/entry type/i).type("shift end{downArrow}{enter}");
    // eslint-disable-next-line
    cy.findByRole("textbox", { name: "file" })
      .clear()
      .type(property.attributes.file.value, { delay: 0 });
    // eslint-disable-next-line
    cy.findByRole("textbox", { name: "name" })
      .clear()
      .type(property.attributes.name.value, { delay: 0 });
    cy.findByRole("button", { name: /submit/i }).click();

    // expect to find the edit to our log but have the same id as before
    cy.findByRole("heading", { name: title, level: 3, timeout: 10000 }).click(); // increased timeout due to server performance changes
    cy.findByTestId("meta-logbooks")
      .invoke("text")
      .should("match", /controls.*e2e-tests.*operations/i);
    cy.findByTestId("meta-tags")
      .invoke("text")
      .should("match", /e2e-test-tag/i);
    cy.findByTestId("meta-entrytype")
      .invoke("text")
      .should("match", /shift end/i);
    cy.findByRole("button", { name: /attachments/i }).click();
    cy.findByRole("img", { name: /testImage/i }).should("exist");
    cy.findByRole("button", { name: /properties/i }).click();
    cy.findByRole("button", { name: "resource" }).should("exist");
    cy.findByText(property.attributes.file.value).should("exist");
    cy.findByText(property.attributes.name.value).should("exist");
  });
});
