const parseRoutes = (node, url, callback) => {
    if(node.path !== '*') {
        let nextURL = url;
        if(node.path) {
            nextURL = `${url}${node.path}/`;
            callback(nextURL, node)    
        }

        if (node.children && node.children.length > 0) {
            node.children.map((child) => parseRoutes(child, nextURL, callback));
        }
    }
};

const filterBaseRoute = (cyRoutes) => cyRoutes
    .find((route) => route.path === '/')
    .children
    .find((route) => route.path === ':language')
    .children

const shouldSkipRoute = route => route?.path.includes('/:');

const getFilteredRoutes = routes => routes.filter(route => !shouldSkipRoute(route));

const LOCALE = 'en';
const BASE_URL = Cypress.env('BASE_URL');
const LOCALE_URL = `${BASE_URL}${LOCALE}/`;
const NOTFOUND_URL = LOCALE_URL + 'azerty/'
const BROKEN_URL = BASE_URL + 'sdsdsdsd';

const TIMEOUT = 20000;

const BLACKLIST = ['/group/:groupId/manage-users/']
let routes = [];

before(() => {
    cy.visit(BASE_URL);
    cy.window().its('cyRoutes', { timeout: TIMEOUT }).then((cyRoutes) => {
        routes = getFilteredRoutes(filterBaseRoute(JSON.parse(cyRoutes)));
    });
})

describe('Application routing', () => {
    it('should navigate to 404 with wrong url', () => {
        cy.visit(NOTFOUND_URL);
        cy.get('[data-test-id="404-view"]', { timeout: TIMEOUT }).should('be.visible');
    });

    it('should redirect when url is broken', () => {
        cy.setCookie('language', LOCALE);
        cy.visit(BROKEN_URL);
        cy.get('div[id="loader-wait"]', { timeout: TIMEOUT }).should('not.exist');
        cy.location('pathname').should('eq', `/${LOCALE}/bimobjects`)
    });

    it.only('should navigate every page with admin user', () => {
        cy.getUserAndLogin("admin");
        parseRoutes({ children: routes }, LOCALE_URL, (nextURL, { element }) => {
            cy.visit(nextURL);
            cy.url().should('eq', nextURL);
            cy.get('div[id="loader-wait"]', { timeout: TIMEOUT }).should('not.exist');
            cy.get('[data-test-id="404-view"]', { timeout: TIMEOUT }).should('not.exist');
            cy.get('[data-cy="logo du Onfly"]', { timeout: TIMEOUT }).should('be.visible');
            if(element && element.props && element.props.isOld === true) {
                cy.get('.old-styles', { timeout: TIMEOUT }).should('be.visible');
            }
        });
    }); 
 
    it('should navigate and be allowed on the correct pages as a member', () => {
        cy.visit(LOCALE_URL);
        cy.getUserAndLogin("member");
        parseRoutes({children: routes }, LOCALE_URL, (nextURL, { element }) => {
            if(element && element.props && element.props.roleAccess) {
                if(BLACKLIST.filter((item) => item.includes(nextURL))) return;
                cy.visit(nextURL);
                cy.url().should('eq', nextURL);
                cy.get('div[id="loader-wait"]', { timeout: TIMEOUT }).should('not.exist');
                if(!element.props.roleAccess.includes("member")) {
                    cy.get('[data-test-id="403-view"]', { timeout: TIMEOUT }).should('be.visible');
                } else {
                    cy.get('[data-test-id="403-view"]', { timeout: TIMEOUT }).should('not.exist');
                }
            } 
        });
    }); 
});
