/* eslint-disable no-undef */
describe('Chat and private messagerie', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/login/email/');
        cy.get('#email-input-login').type('demo@42.fr').should('have.value', 'demo@42.fr');
        cy.get('#password-input-login').type('password').should('have.value', 'password');
        cy.get('#login-email-submit').click();
        cy.url().should('equal', 'http://localhost:3000/home');
    });

    it('Workflow work as expected', () => {
        cy.get('#messagerie-menu').click();
        cy.get('#input-messagerie-email').type('staff@transcendence.fr');
        cy.get('#submit-button-messagerie').click();
        cy.get('#answer-chat-input').type('hello world');
        cy.get('#button-answer-chat-submit').click();
        cy.get('#msg-chat-0 > div.content-message-right').should('contain', 'hello world');
    });
});