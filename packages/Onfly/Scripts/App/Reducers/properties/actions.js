import { SET_DOMAINS, SET_FILTER, SET_API_STATE } from './constants';

export const setDomains = (domains) => ({
  type: SET_DOMAINS,
  domains,
});

export const setFilter = (filter) => ({
  type: SET_FILTER,
  filter,
});

export const setApiState = (apiState) => ({
  type: SET_API_STATE,
  apiState,
});
