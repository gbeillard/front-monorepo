const LOCALE = 'en';
const BASE_URL = Cypress.env('BASE_URL');
const LOCALE_URL = `${BASE_URL}${LOCALE}/`;
const HOME_URL = `${LOCALE_URL}bimobjects`;
const FAKE_PASSWORD = 'test';

describe('Login', () => {
    it('should be redirected to login page', () => {
        cy.clearLocalStorage('Temporary_token');
        cy.visit(BASE_URL);
        cy.getDataId('login', { timeout: 5000 }).should('be.visible');
    });

    it('should fail when wrong credentials are provided', () => {
        cy.visit(BASE_URL);
        cy.navigateToLogin();
        cy.fixture('users').then(users => {
            const { email } = users['admin'];
            cy.fillLoginForm(email, FAKE_PASSWORD);
        });
        cy.getDataId('TextField-Helper', { timeout: 1000 })
            .should('be.visible')
            .should('have.text', 'Invalid credentials');
    });

    it('should succeed login', () => {
        cy.visit(BASE_URL);
        cy.navigateToLogin();
        cy.getUserAndLogin("admin");
        cy.url().should('eq', HOME_URL);
    });
});

describe('Lost Password', () => {
    it('should display lost password button', () => {
        cy.visit(BASE_URL);
        cy.navigateToLogin();
        cy.getDataId('button', { timeout: 5000 }).contains('Lost password').should('be.visible').click();
        cy.get('h2').should('contain', 'Lost password');
    });
});

describe('Logout', () => {
    before(() => {
        cy.visit(LOCALE_URL);
        cy.navigateToLogin();
        cy.getUserAndLogin("admin");
    });

    it('should succeed logout', () => {
        cy.get('#user_menu', { timeout: 15000 })
            .should('be.visible')
            .then($userMenu => {
                cy.wrap($userMenu).click();
            })
            .then($logout => {
                cy.wrap($logout);
                cy.getDataId('Logout', { timeout: 15000 })
                    .should('be.visible')
                    .then($logoutBtn => {
                        cy.wrap($logoutBtn).click();
                    });
            });
        cy.visit(BASE_URL);
        cy.getDataId('login', { timeout: 5000 }).should('be.visible');
    });
});
