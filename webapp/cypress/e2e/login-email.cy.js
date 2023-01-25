/* eslint-disable no-undef */
describe('Email authentication', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/login/email/');
    });

    it('Should not log user because email have the wrong format', () => {
        cy.get('#email-input-login').type('demo').should('have.value', 'demo');
        cy.get('#password-input-login').type('password').should('have.value', 'password');
        cy.get('#login-email-submit').click();
        cy.url().should('equal', 'http://localhost:3000/login/email/');
    });

    it('Should not log user because email is incorrect', () => {
        cy.get('#email-input-login').type('demo@42.com').should('have.value', 'demo@42.com');
        cy.get('#password-input-login').type('password').should('have.value', 'password');
        cy.get('#login-email-submit').click();
        cy.url().should('equal', 'http://localhost:3000/login/email/');
    });

    it('Should not log user because password is incorrect', () => {
        cy.get('#email-input-login').type('demo@42.fr').should('have.value', 'demo@42.fr');
        cy.get('#password-input-login').type('pass').should('have.value', 'pass');
        cy.get('#login-email-submit').click();
        cy.url().should('equal', 'http://localhost:3000/login/email/');
    });

    it('Should log user', () => {
        cy.get('#email-input-login').type('demo@42.fr').should('have.value', 'demo@42.fr');
        cy.get('#password-input-login').type('password').should('have.value', 'password');
        cy.get('#login-email-submit').click();
        cy.url().should('equal', 'http://localhost:3000/home');
    });
});