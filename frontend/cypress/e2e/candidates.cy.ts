describe('Candidate Management 👥', () => {
    beforeEach(() => {
        // Login before each test
        cy.clearLocalStorage()
        cy.visit('/')
        cy.get('input[name="email"]').type('test@example.com')
        cy.get('input[name="password"]').type('Test123!')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/dashboard')
    })

    it('should display candidate list 📋', () => {
        cy.get('table').should('exist')
        cy.contains('Agregar Candidato').should('exist')
    })

    it('should create a new candidate ✨', () => {
        // Click add candidate button
        cy.contains('Agregar Candidato').click()

        // Fill candidate form
        cy.get('input[name="firstName"]').type('John')
        cy.get('input[name="lastName"]').type('Doe')
        cy.get('input[name="email"]').type(`john${Date.now()}@example.com`)
        cy.get('input[name="phone"]').type('1234567890')
        cy.get('input[name="currentPosition"]').type('Software Engineer')
        cy.get('input[name="yearsOfExperience"]').type('5')

        // Add technical skills
        cy.get('input[placeholder="Agregar habilidad"]').type('JavaScript{enter}')
        cy.get('input[placeholder="Agregar habilidad"]').type('React{enter}')

        // Add education
        cy.get('input[name="education.0.institution"]').type('Test University')
        cy.get('input[name="education.0.degree"]').type('Computer Science')
        cy.get('input[name="education.0.startDate"]').type('2018-01')
        cy.get('input[name="education.0.endDate"]').type('2022-01')

        // Save candidate
        cy.contains('Guardar').click()

        // Should redirect to list and show success message
        cy.url().should('include', '/candidates')
        cy.get('.MuiAlert-root').should('contain', 'éxito')
    })

    it('should edit an existing candidate ✏️', () => {
        // Click edit button of first candidate
        cy.get('button[aria-label="Editar"]').first().click()

        // Update some fields
        cy.get('input[name="currentPosition"]').clear().type('Senior Developer')
        cy.get('input[name="yearsOfExperience"]').clear().type('6')

        // Save changes
        cy.contains('Guardar').click()

        // Should redirect to list and show success message
        cy.url().should('include', '/candidates')
        cy.get('.MuiAlert-root').should('contain', 'éxito')
    })

    it('should delete a candidate ❌', () => {
        // Store initial number of rows
        cy.get('table tbody tr').then($rows => {
            const initialCount = $rows.length

            // Click delete button of first candidate
            cy.get('button[aria-label="Eliminar"]').first().click()

            // Confirm deletion in dialog
            cy.contains('Sí, eliminar').click()

            // Should show success message
            cy.get('.MuiAlert-root').should('contain', 'éxito')

            // Should have one less row
            cy.get('table tbody tr').should('have.length', initialCount - 1)
        })
    })
}) 