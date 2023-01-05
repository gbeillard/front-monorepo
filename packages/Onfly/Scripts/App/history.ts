/** always import the same history package version than react-router-dom while we use HistoryRouter instead of BrowserRouter
 * react-router-dom explaination below:
 */

import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export { history };