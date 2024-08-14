/// <reference types="cypress" />

describe("Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should get an error if the email is not provided", () => {
    cy.visit("http://localhost:4200/login");
    cy.get("input[name='email']").type("bad@example.com");
    cy.get("input[name='password']").type("badpassword");
    cy.get("button[type='submit']").click();

    cy.get("mat-dialog-content").should(
      "contain",
      "Please fill all the required fields correctly."
    );
  });

  it("should be able to create a user and login", () => {
    cy.visit("http://localhost:4200/signup");
    cy.get("input[name='firstname']").then(($firstname) => {
      const email = Date.now() + "@example.com";
      cy.wrap($firstname).type("test");
      cy.get("input[name='lastname']").type("user");
      cy.get("input[name='email']").type(email);
      cy.get("input[name='password']").type("testpassword");
      cy.get("input[name='confirmpassword']").type("testpassword");
      cy.get("button[type='submit']").click();

      cy.location("pathname").should("eq", "/login");

      cy.get("input[name='email']").type(email);
      cy.get("input[name='password']").type("testpassword");
      cy.get("button[type='submit']").click();
    });

    cy.location("pathname").should("eq", "/home");
    cy.get("button > span[class='mdc-button__label']").should(
      "contain",
      "Hi, test"
    );

    cy.get("button[ng-reflect-router-link='/login']")
      .trigger("mouseover")
      .then(() => {
        cy.contains("Logout").click({ force: true });
        cy.location("pathname").should("eq", "/home");
      });
  });
});
