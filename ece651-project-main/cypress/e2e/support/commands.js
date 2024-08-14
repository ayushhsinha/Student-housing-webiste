Cypress.Commands.add("login", (email, password) => {
  cy.session(email, () => {
    cy.visit("http://localhost:4200/login");

    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type(password);
    cy.get("button[type='submit']").click();
    cy.get("button > span[class='mdc-button__label']").should(
      "contain",
      "Hi, test"
    );
  });
});

Cypress.Commands.add("createUser", (email, password) => {
  cy.visit("http://localhost:4200/signup");

  cy.get("input[name='firstname']").then(($firstname) => {
    cy.wrap($firstname).type("test");
    cy.get("input[name='lastname']").type("user");
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type(password);
    cy.get("input[name='confirmpassword']").type(password);
    cy.get("button[type='submit']").click();

    cy.location("pathname").should("eq", "/login");

    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type(password);
    cy.get("button[type='submit']").click();
  });
});
