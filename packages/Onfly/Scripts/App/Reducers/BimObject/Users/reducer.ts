import Immutable from 'seamless-immutable';
import {
  UserEditorAuthorization,
  UsersActions,
  FETCH_AUTHORIZATION,
  FETCH_AUTHORIZATION_SUCCESS,
  FETCH_AUTHORIZATION_ERROR,
} from './types';

export const baseState = {
  api: {
    fetchAutorization: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
  userAuthorization: null as UserEditorAuthorization,
};

const initialState = Immutable(baseState);

const bimObjectUserReducer = (state = initialState, action: UsersActions) => {
  switch (action.type) {
    case FETCH_AUTHORIZATION:
      return state
        .setIn(['api', 'fetchAutorization', 'pending'], true)
        .setIn(['api', 'fetchAutorization', 'success'], false)
        .setIn(['api', 'fetchAutorization', 'error'], undefined);
    case FETCH_AUTHORIZATION_SUCCESS:
      return state
        .setIn(['api', 'fetchAutorization', 'pending'], false)
        .setIn(['api', 'fetchAutorization', 'success'], true)
        .setIn(['api', 'fetchAutorization', 'error'], undefined)
        .setIn(['userAuthorization'], action.userAuthorization);
    case FETCH_AUTHORIZATION_ERROR:
      return state
        .setIn(['api', 'fetchAutorization', 'pending'], false)
        .setIn(['api', 'fetchAutorization', 'success'], false)
        .setIn(['api', 'fetchAutorization', 'error'], action.error);
    default:
      return state;
  }
};

export default bimObjectUserReducer;