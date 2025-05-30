/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
    interface Chainable {
        login(email: string, password: string): Chainable<void>;
    }
}

describe('Authentication Flow 🔐', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        cy.clearLocalStorage()
        cy.visit('/')
    });

    it('should display login form 📝', () => {
        cy.get('input[name="email"]').should('exist')
        cy.get('input[name="password"]').should('exist')
        cy.get('button[type="submit"]').should('exist')
    });

    it('should show error with invalid credentials ❌', () => {
        cy.get('input[name="email"]').type('wrong@email.com')
        cy.get('input[name="password"]').type('wrongpassword')
        cy.get('button[type="submit"]').click()

        // Should show error message
        cy.get('.MuiAlert-root').should('contain', 'credenciales inválidas')
    });

    it('should register a new user successfully ✨', () => {
        // Navigate to register page
        cy.contains('Registrarse').click()

        // Fill registration form
        cy.get('input[name="firstName"]').type('Test')
        cy.get('input[name="lastName"]').type('User')
        cy.get('input[name="email"]').type(`test${Date.now()}@example.com`)
        cy.get('input[name="password"]').type('Test123!')
        cy.get('input[name="confirmPassword"]').type('Test123!')

        // Submit form
        cy.get('button[type="submit"]').click()

        // Should redirect to dashboard
        cy.url().should('include', '/dashboard')
    });

    it('should login successfully and logout 🔄', () => {
        // Login
        cy.get('input[name="email"]').type('test@example.com')
        cy.get('input[name="password"]').type('Test123!')
        cy.get('button[type="submit"]').click()

        // Should redirect to dashboard
        cy.url().should('include', '/dashboard')

        // Logout
        cy.contains('Cerrar sesión').click()

        // Should redirect to login
        cy.url().should('not.include', '/dashboard')
    });
}); 