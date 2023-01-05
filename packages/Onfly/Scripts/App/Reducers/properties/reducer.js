import Immutable from 'seamless-immutable';
import { SET_DOMAINS, SET_FILTER, SET_API_STATE } from './constants';

const initialState = Immutable({
  domains: [],
  filter: {
    text: '',
    dataTypes: [],
  },
  apiState: {
    fetch: {
      completed: false,
    },
  },
});

const domainsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DOMAINS:
      return state.set('domains', action.domains);
    case SET_FILTER:
      return state.set('filter', action.filter);
    case SET_API_STATE:
      return state.set('apiState', action.apiState);
    default:
      return state;
  }
};

export default domainsReducer;
