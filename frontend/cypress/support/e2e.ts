/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="chai" />

import './commands';
import chai from 'chai';
import path from 'path';

export { };

declare global {
    namespace Cypress {
        interface Chainable {
            task(event: string, args?: any): Chainable<any>;
        }
    }
}

// Extender la interfaz global de Cypress
declare global {
    interface Window {
        Cypress: any;
    }
}

const cy = (window as any).Cypress;

cy.on('uncaught:exception', (err: Error) => {
    // returning false here prevents Cypress from failing the test
    console.error('Uncaught exception:', err);
    return false;
});

// Add custom assertions
declare global {
    namespace Chai {
        interface Assertion {
            haveSimilarTiming(baseline: number, tolerance: number): void;
        }
    }
}

chai.Assertion.addMethod('haveSimilarTiming', function (baseline: number, tolerance: number) {
    const timing = this._obj as number;
    const lowerBound = baseline - tolerance;
    const upperBound = baseline + tolerance;

    this.assert(
        timing >= lowerBound && timing <= upperBound,
        `expected #{this} to be within ${tolerance}ms of ${baseline}ms`,
        `expected #{this} not to be within ${tolerance}ms of ${baseline}ms`,
        baseline,
        timing
    );
});

cy.config('retries', {
    runMode: 2,
    openMode: 0
});

interface TestResult {
    state: string;
    title: string;
    err?: {
        message: string;
    };
}

interface TestRunnable {
    parent: {
        title: string;
    };
}

cy.on('test:after:run', (test: TestResult, runnable: TestRunnable) => {
    if (test.state === 'failed') {
        const screenshotName = `${runnable.parent.title} -- ${test.title} (failed).png`;
        const screenshotsFolder = cy.config('screenshotsFolder');
        const specName = cy.spec?.name || '';

        const screenshot = path.join(
            screenshotsFolder,
            specName,
            screenshotName
        );

        console.log('Test failed. Screenshot saved:', screenshot);

        cy.task('log', {
            testTitle: test.title,
            error: test.err?.message,
            screenshot
        });
    }
}); 