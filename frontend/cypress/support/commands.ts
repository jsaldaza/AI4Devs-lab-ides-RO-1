/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare global {
    namespace Cypress {
        interface Chainable<Subject = any> {
            login(email: string, password: string): Chainable<void>;
            register(firstName: string, lastName: string, email: string, password: string): Chainable<void>;
            logout(): Chainable<void>;
            checkLoggedIn(): Chainable<void>;
            checkLoggedOut(): Chainable<void>;
        }
    }
}

export { };

// @ts-ignore
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
});

// @ts-ignore
Cypress.Commands.add('register', (firstName: string, lastName: string, email: string, password: string) => {
    cy.visit('/register');
    cy.get('input[name="firstName"]').type(firstName);
    cy.get('input[name="lastName"]').type(lastName);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
});

// @ts-ignore
Cypress.Commands.add('logout', () => {
    cy.window().then((win) => {
        win.localStorage.removeItem('token');
        win.localStorage.removeItem('user');
    });
    cy.visit('/login');
});

// @ts-ignore
Cypress.Commands.add('checkLoggedIn', () => {
    cy.window().its('localStorage.token').should('exist');
    cy.window().its('localStorage.user').should('exist');
});

// @ts-ignore
Cypress.Commands.add('checkLoggedOut', () => {
    cy.window().its('localStorage.token').should('not.exist');
    cy.window().its('localStorage.user').should('not.exist');
}); 