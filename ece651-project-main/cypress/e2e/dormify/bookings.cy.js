/// <reference types="cypress" />
import "../support/commands";
const email = Math.floor(Math.random() * 1000000) + `@example.com`;

describe("Bookings", () => {
  before(() => {
    cy.createUser(email, "testpassword");
  });

  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should be able to make a booking", () => {
    cy.login(email, "testpassword");
    cy.visit("http://localhost:4200/properties");

    cy.location("pathname").should("eq", "/properties");
  });
});
