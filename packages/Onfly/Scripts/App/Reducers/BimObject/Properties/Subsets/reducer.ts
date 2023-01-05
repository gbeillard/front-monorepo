import Immutable from 'seamless-immutable';

import {
  SubsetsActions,
  ADD_SUBSET,
  ADD_SUBSET_SUCCESS,
  ADD_SUBSET_ERROR,
  REMOVE_SUBSET,
  REMOVE_SUBSET_SUCCESS,
  REMOVE_SUBSET_ERROR,
} from './types';

export const baseState = {
  api: {
    addSubsets: {
      pending: false,
      success: false,
      error: undefined,
    },
    removeSubsets: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
};

const initialState = Immutable(baseState);

const bimObjectPropertiesSubsetsReducer = (state = initialState, action: SubsetsActions) => {
  switch (action.type) {
    case ADD_SUBSET:
      return state
        .setIn(['api', 'addSubset', 'pending'], true)
        .setIn(['api', 'addSubset', 'success'], false)
        .setIn(['api', 'addSubset', 'error'], undefined);
    case ADD_SUBSET_SUCCESS:
      return state
        .setIn(['api', 'addSubset', 'pending'], false)
        .setIn(['api', 'addSubset', 'success'], true)
        .setIn(['api', 'addSubset', 'error'], undefined);
    case ADD_SUBSET_ERROR:
      return state
        .setIn(['api', 'addSubset', 'pending'], false)
        .setIn(['api', 'addSubset', 'success'], false)
        .setIn(['api', 'addSubset', 'error'], action.error);
    case REMOVE_SUBSET:
      return state
        .setIn(['api', 'removeSubset', 'pending'], true)
        .setIn(['api', 'removeSubset', 'success'], false)
        .setIn(['api', 'removeSubset', 'error'], undefined);
    case REMOVE_SUBSET_SUCCESS:
      return state
        .setIn(['api', 'removeSubset', 'pending'], false)
        .setIn(['api', 'removeSubset', 'success'], true)
        .setIn(['api', 'removeSubset', 'error'], undefined);
    case REMOVE_SUBSET_ERROR:
      return state
        .setIn(['api', 'removeSubset', 'pending'], false)
        .setIn(['api', 'removeSubset', 'success'], false)
        .setIn(['api', 'removeSubset', 'error'], action.error);
    default:
      return state;
  }
};

export default bimObjectPropertiesSubsetsReducer;