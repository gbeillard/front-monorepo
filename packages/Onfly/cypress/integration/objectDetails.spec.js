const LOCALE = 'en';
const BASE_URL = Cypress.env('BASE_URL_HAGER');
const LOCALE_URL = `${BASE_URL}${LOCALE}/bimobject/216518/details`;

describe('Object Details page', () => {
    before(() => {
        cy.log(LOCALE_URL);
        cy.oneCommandLogin(LOCALE_URL, 'admin');
    });

    it('should get an object with configurator button', () => {
        
        cy.get('#refsAndTags > button', { timeout: 10000 }).first()
            .then(
                (button) => { 
                    button.click();                   
                    cy.getDataId('modal-configurator-page').should('be.visible');
                }
            );

        
    });

    
});