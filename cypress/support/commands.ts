/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to set auth tokens in localStorage and cookies
       * @example cy.setAuthTokens()
       */
      setAuthTokens(): Chainable<void>;
      /**
       * Custom command to clear auth tokens from localStorage and cookies
       * @example cy.clearAuthTokens()
       */
      clearAuthTokens(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setAuthTokens', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'test-refresh-token');
    win.document.cookie = 'accessToken=Bearer test-access-token; path=/';
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
    // Очищаем cookie
    win.document.cookie.split(';').forEach((c) => {
      const cookieName = c.split('=')[0].trim();
      if (cookieName) {
        win.document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  });
});

export {};

