import { composeStories } from "@storybook/react";
import * as stories from "stories/Description.stories";

const { Default } = composeStories(stories);

const testFilePath = "./src/mocks/fixtures/testImage.jpg";
const dimensionedTestFilePath = "./src/mocks/fixtures/test500x100.jpg";

describe("Attachments Features", () => {
  it("when an image is uploaded via system dialog, then it is displayed", () => {
    cy.mount(<Default />);

    cy.get("input[type=file]").selectFile(testFilePath, { force: true });
    cy.get("input[type=file]").selectFile(dimensionedTestFilePath, {
      force: true
    });

    cy.findByRole("img", { name: "testImage.jpg" }).should("exist");
    cy.findByRole("img", { name: "test500x100.jpg" }).should("exist");
  });

  it("when an image is uploaded via drag-and-drop, then it is displayed", () => {
    cy.mount(<Default />);

    cy.findByText(/drag here/i).selectFile(testFilePath, {
      action: "drag-drop"
    });
    cy.findByText(/drag here/i).selectFile(dimensionedTestFilePath, {
      action: "drag-drop"
    });

    cy.findByRole("img", { name: "testImage.jpg" }).should("exist");
    cy.findByRole("img", { name: "test500x100.jpg" }).should("exist");
  });

  it("when the same image is uploaded many times, then it is displayed many times", () => {
    cy.mount(<Default />);

    // The files are displayed in the doc by name
    cy.get("input[type=file]").selectFile(testFilePath, { force: true });
    cy.get("input[type=file]").selectFile(testFilePath, { force: true });
    cy.get("input[type=file]").selectFile(testFilePath, { force: true });

    // But each have unique src attributes
    const srcs = new Set();

    cy.findAllByRole("img", { name: "testImage.jpg" })
      .should("have.length", 3)
      .each((it) => {
        cy.wrap(it)
          .invoke("attr", "src")
          .then((src) => srcs.add(src));
      })
      .then(() => {
        cy.wrap(srcs).should("have.length", 3);
      });
  });

  it("should embed images successfully", () => {
    cy.mount(<Default />);

    // When the user embeds an image
    cy.findByRole("textbox", { name: /description/i }).type("some text");
    cy.findByRole("button", { name: /embed image/i }).click();
    cy.findByLabelText(/choose an image/i).selectFile(dimensionedTestFilePath, {
      force: true
    });

    // Then the image is previewed in the modal
    cy.findByRole("img", { name: /preview of test500x100.jpg/i }).should(
      "exist"
    );
    cy.findByRole("textbox", { name: /scaling factor/i }).should(
      "have.value",
      "1"
    );
    cy.findByRole("textbox", { name: /width/i }).should("have.value", "500");
    cy.findByRole("textbox", { name: /height/i }).should("have.value", "100");

    // And when embedded
    cy.findByRole("button", { name: /confirm embed/i }).click();

    // Then the description markup is updated and image appears in the attachments
    cy.findByRole("textbox", { name: /description/i })
      .invoke("val")
      .then((val) => {
        expect(val).match(/^some text.*!\[\]/);
      });
    cy.findByRole("img", { name: "test500x100.jpg" }).should("exist");

    // And when the image is removed after typing more in the description
    cy.findByRole("textbox", { name: /description/i }).type("after attachment");
    cy.findByRole("button", { name: /remove test500x100.jpg/i }).click();

    // Then the image is removed from attachments
    // and the description is updated
    cy.findByRole("img", { name: "test500x100.jpg" }).should("not.exist");
    cy.findByRole("textbox", { name: /description/i }).should(
      "have.value",
      "some textafter attachment"
    );
  });

  it("should disable attachments if that feature is disabled", () => {
    cy.mount(<Default attachmentsDisabled />);

    cy.findByLabelText(/Attachments \(Disabled\)/i).should("exist");
    cy.findByRole("button", { name: /embed image/i }).should("be.disabled");
    cy.get("#attachments-upload").should("be.disabled"); // hidden file input
    cy.findByText(/file upload disabled/i).should("exist");
  });
});
