/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="chai" />

import { expect } from 'chai';

describe('Performance Tests', () => {
    const API_URL = (cy as any).env('API_URL') || 'http://localhost:3000';
    const TEST_EMAIL = (cy as any).env('TEST_USER_EMAIL') || 'test@example.com';
    const TEST_PASSWORD = (cy as any).env('TEST_USER_PASSWORD') || 'Test123!';

    // Configuración de tiempos máximos aceptables
    const PERFORMANCE_THRESHOLDS = {
        pageLoad: (cy as any).env('PAGE_LOAD_THRESHOLD') || 3000,
        apiResponse: (cy as any).env('API_RESPONSE_THRESHOLD') || 1000,
        firstPaint: (cy as any).env('FIRST_PAINT_THRESHOLD') || 1500,
        timeToInteractive: (cy as any).env('TTI_THRESHOLD') || 3500
    };

    beforeEach(() => {
        cy.visit('/', {
            timeout: PERFORMANCE_THRESHOLDS.pageLoad
        });
    });

    it('should load login page within threshold', () => {
        cy.visit('/login', {
            timeout: PERFORMANCE_THRESHOLDS.pageLoad
        });
        cy.window().then((win: Window) => {
            const performance = win.performance;
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const loadTime = navigation.domContentLoadedEventEnd - navigation.startTime;
            expect(loadTime).to.be.lessThan(PERFORMANCE_THRESHOLDS.pageLoad);
        });
    });

    it('should load dashboard page under 3 seconds', () => {
        cy.login('test@example.com', 'password123');
        cy.window().then((win: Window) => {
            const performance = win.performance;
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const loadTime = navigation.domContentLoadedEventEnd - navigation.startTime;
            cy.wrap({ value: loadTime }).its('value').should('be.lessThan', 3000);
        });
    });

    it('should have acceptable First Contentful Paint', () => {
        cy.visit('/login', {
            timeout: PERFORMANCE_THRESHOLDS.pageLoad
        });
        cy.window().then((win: Window) => {
            const performance = win.performance;
            performance.getEntriesByType('paint').forEach((entry: PerformanceEntry) => {
                if (entry.name === 'first-contentful-paint') {
                    expect(entry.startTime).to.be.lessThan(PERFORMANCE_THRESHOLDS.firstPaint);
                }
            });
        });
    });

    it('should have acceptable Time to Interactive', () => {
        cy.visit('/login');
        cy.window().then((win: Window) => {
            const performance = win.performance;
            const timeToInteractive = performance.now();
            cy.wrap({ value: timeToInteractive }).its('value').should('be.lessThan', 3500);
        });
    });

    it('should load and cache static assets', () => {
        cy.visit('/login');
        cy.window().then((win: Window) => {
            const performance = win.performance;
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

            resources.forEach((resource) => {
                cy.request(resource.name).then((response) => {
                    cy.wrap(response.headers).should('have.property', 'cache-control');
                });
            });
        });
    });

    it('should have acceptable API response times', () => {
        const startTime = Date.now();
        cy.request({
            method: 'POST',
            url: `${API_URL}/api/auth/login`,
            body: {
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            },
            failOnStatusCode: false,
            timeout: PERFORMANCE_THRESHOLDS.apiResponse
        }).then(() => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            expect(responseTime).to.be.lessThan(PERFORMANCE_THRESHOLDS.apiResponse);
        });
    });

    it('should maintain performance under load', () => {
        const numberOfRequests = (cy as any).env('LOAD_TEST_REQUESTS') || 5;
        const requests = Array(numberOfRequests).fill(null).map(() =>
            cy.request({
                method: 'POST',
                url: `${API_URL}/api/auth/login`,
                body: {
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD
                },
                failOnStatusCode: false,
                timeout: PERFORMANCE_THRESHOLDS.apiResponse
            })
        );

        cy.wrap(Promise.all(requests)).then((responses: any[]) => {
            responses.forEach((response) => {
                expect(response.duration).to.be.lessThan(PERFORMANCE_THRESHOLDS.apiResponse * 2);
            });
        });
    });
}); 