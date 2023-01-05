import { SortDirection } from '@bim-co/componentui-foundation';
import Immutable from 'seamless-immutable';

import {
  FETCH_SPACES,
  FETCH_SPACES_SUCCESS,
  FETCH_SPACES_ERROR,
  SET_FILTER_SEARCH,
  CREATE_SPACE_ERROR,
  CREATE_SPACE_SUCCESS,
  CREATE_SPACE,
  DELETE_SPACE,
  DELETE_SPACE_SUCCESS,
  DELETE_SPACE_ERROR,
  UPDATE_STATUS,
  UPDATE_SPACE,
  UPDATE_SPACE_SUCCESS,
  UPDATE_SPACE_ERROR,
  SET_SORT_ORDER_BY,
  SET_SORT_DIRECTION,
  ASK_AUTHORIZATION,
  ASK_AUTHORIZATION_SUCCESS,
  ASK_AUTHORIZATION_ERROR,
  SpacesStatus,
} from './constants';
import { Space, SpacesActions } from './types';
import { addAskAuthorization, deleteSpace, setDefaultStatus, updateSpace, updateSpaceStatus } from './utils';

export const baseState = {
  spaces: [] as Space[],
  sortOrderBy: '',
  sortDirection: SortDirection.Asc,
  filter: {
    search: '',
  },
  api: {
    fetchSpaces: {
      pending: false,
      success: false,
      error: undefined,
    },
    createSpace: {
      pending: false,
      success: false,
      error: undefined,
    },
    deleteSpace: {
      pending: false,
      success: false,
      error: undefined,
    },
    updateSpace: {
      pending: false,
      success: false,
      error: undefined,
    },
    askAuthorization: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
};

const initialState = Immutable(baseState);

const spacesReducer = (state = initialState, action: SpacesActions) => {
  switch (action.type) {
    case FETCH_SPACES:
      return state
        .setIn(['api', 'fetchSpaces', 'pending'], true)
        .setIn(['api', 'fetchSpaces', 'success'], false)
        .setIn(['api', 'fetchSpaces', 'error'], undefined);
    case FETCH_SPACES_SUCCESS:
      return state
        .setIn(['api', 'fetchSpaces', 'pending'], false)
        .setIn(['api', 'fetchSpaces', 'success'], true)
        .setIn(['api', 'fetchSpaces', 'error'], undefined)
        .setIn(['spaces'], setDefaultStatus(action.spaces));
    case FETCH_SPACES_ERROR:
      return state
        .setIn(['api', 'fetchSpaces', 'pending'], false)
        .setIn(['api', 'fetchSpaces', 'success'], false)
        .setIn(['api', 'fetchSpaces', 'error'], action.error);
    case CREATE_SPACE:
      return state
        .setIn(['api', 'createSpace', 'pending'], true)
        .setIn(['api', 'createSpace', 'success'], false)
        .setIn(['api', 'createSpace', 'error'], undefined);
    case CREATE_SPACE_SUCCESS:
      return state
        .setIn(['api', 'createSpace', 'pending'], false)
        .setIn(['api', 'createSpace', 'success'], true)
        .setIn(['api', 'createSpace', 'error'], undefined)
        .update('spaces', (spaces) => [...spaces, action.space]);
    case CREATE_SPACE_ERROR:
      return state
        .setIn(['api', 'createSpace', 'pending'], false)
        .setIn(['api', 'createSpace', 'success'], false)
        .setIn(['api', 'createSpace', 'error'], action.error);
    case SET_FILTER_SEARCH:
      return state.setIn(['filter', 'search'], action.search);
    case UPDATE_STATUS:
      return state.update('spaces', (spaces) =>
        updateSpaceStatus(spaces, action.space, action.status)
      );
    case DELETE_SPACE:
      return state
        .setIn(['spaces'], deleteSpace(state.spaces, action.spaceId))
        .setIn(['api', 'deleteSpace', 'pending'], true)
        .setIn(['api', 'deleteSpace', 'success'], false)
        .setIn(['api', 'deleteSpace', 'error'], undefined);
    case DELETE_SPACE_SUCCESS:
      return state
        .setIn(['api', 'deleteSpace', 'pending'], false)
        .setIn(['api', 'deleteSpace', 'success'], true)
        .setIn(['api', 'deleteSpace', 'error'], undefined);
    case DELETE_SPACE_ERROR:
      return state
        .setIn(['api', 'deleteSpace', 'pending'], false)
        .setIn(['api', 'deleteSpace', 'success'], false)
        .setIn(['api', 'deleteSpace', 'error'], action.error);
    case UPDATE_SPACE:
      return state
        .setIn(['spaces'], updateSpace(state.spaces, action.space))
        .setIn(['api', 'updateSpace', 'pending'], true)
        .setIn(['api', 'updateSpace', 'success'], false)
        .setIn(['api', 'updateSpace', 'error'], undefined);
    case UPDATE_SPACE_SUCCESS:
      return state
        .setIn(['api', 'updateSpace', 'pending'], false)
        .setIn(['api', 'updateSpace', 'success'], true)
        .setIn(['api', 'updateSpace', 'error'], undefined);
    case UPDATE_SPACE_ERROR:
      return state
        .setIn(['api', 'updateSpace', 'pending'], false)
        .setIn(['api', 'updateSpace', 'success'], false)
        .setIn(['api', 'updateSpace', 'error'], action.error);
    case SET_SORT_ORDER_BY:
      return state.set('sortOrderBy', action.sortOrderBy);
    case SET_SORT_DIRECTION:
      return state.set('sortDirection', action.sortDirection);
    case ASK_AUTHORIZATION:
      return state
        .setIn(['api', 'askAuthorization', 'pending'], true)
        .setIn(['api', 'askAuthorization', 'success'], false)
        .setIn(['api', 'askAuthorization', 'error'], undefined);
    case ASK_AUTHORIZATION_SUCCESS:
      return state
        .update('spaces', (spaces) => addAskAuthorization(spaces, action.spaceId, action.requestId))
        .setIn(['api', 'askAuthorization', 'pending'], false)
        .setIn(['api', 'askAuthorization', 'success'], action.spaceId)
        .setIn(['api', 'askAuthorization', 'error'], undefined);
    case ASK_AUTHORIZATION_ERROR:
      return state
        .setIn(['api', 'askAuthorization', 'pending'], false)
        .setIn(['api', 'askAuthorization', 'success'], false)
        .setIn(['api', 'askAuthorization', 'error'], action.error);
    default:
      return state;
  }
};

export default spacesReducer;