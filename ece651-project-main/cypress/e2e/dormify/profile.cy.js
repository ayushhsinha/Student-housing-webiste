/// <reference types="cypress" />
import "../support/commands";
const email = Math.floor(Math.random() * 1000000) + `@example.com`;

describe("Profile", () => {
  before(() => {
    cy.createUser(email, "testpassword");
  });

  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should be able to see its profile", () => {
    cy.login(email, "testpassword");
    cy.visit("http://localhost:4200/profile");

    cy.get("div[class='container'] > h1").should(
      "contain",
      "Welcome test user"
    );
  });
});
