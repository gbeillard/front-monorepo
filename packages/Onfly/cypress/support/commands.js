Cypress.Commands.add('fillLoginForm', (email, password) => {
    cy.get('[data-test-id="TextField-Input"]').not('[type="password"]').type(email);
    cy.get('[data-test-id="TextField-Input"][type="password"]').type(password);
    cy.get('button').contains('Sign in').click();
});

Cypress.Commands.add('login', (email, password) => {
    cy.fillLoginForm(email, password);
    cy.get('[data-test-id="Select"]', { timeout: 10000 }).should('be.visible');
    cy.get('li[id="user_menu"]', { timeout: 15000 }).should('be.visible');
});

Cypress.Commands.add('navigateToLogin', () => {
    cy.get('[class="btn-content"] > [data-test-id="button"]').click();
    cy.get('h2').should('have.text', 'Sign in');
});

Cypress.Commands.add('getUserAndLogin', (user) => {
    cy.fixture('users').then(users => {
        const { email, password } = users[user];
        cy.login(email, password);
    });
});

Cypress.Commands.add('getDataId', id => {
    cy.get(`[data-test-id=${id}]`);
});

Cypress.Commands.add('oneCommandLogin', (url, user) => {
    cy.visit(url);
    cy.navigateToLogin();
    cy.getUserAndLogin(user);
});
