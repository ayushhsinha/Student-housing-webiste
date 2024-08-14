/// <reference types="cypress" />

import "../support/commands";
const email = Math.floor(Math.random() * 1000000) + `@example.com`;
describe("Properties", () => {
  before(() => {
    cy.createUser(email, "testpassword");
  });

  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should be able to see properties", () => {
    cy.visit("http://localhost:4200/properties");

    cy.get("div[class='container']").find(".property").should("exist");
  });
});
