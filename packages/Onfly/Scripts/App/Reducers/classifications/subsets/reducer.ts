import Immutable from 'seamless-immutable';

import {
  SubsetsActions,
  FETCH_SUBSETS,
  FETCH_SUBSETS_SUCCESS,
  FETCH_SUBSETS_ERROR,
  ADD_SUBSETS,
  ADD_SUBSETS_SUCCESS,
  ADD_SUBSETS_ERROR,
  REMOVE_SUBSET,
  REMOVE_SUBSET_SUCCESS,
  REMOVE_SUBSET_ERROR,
  SET_FILTER,
} from './types';
import { Subset } from '../../Sets/Subsets/types';

export const baseState = {
  api: {
    fetchSubsets: {
      pending: false,
      error: undefined,
    },
    addSubsets: {
      pending: false,
      error: undefined,
    },
    removeSubsets: {
      pending: false,
      error: undefined,
    },
  },
  subsets: [] as Subset[],
  filter: {
    text: '',
    setId: null as number,
  },
};

const initialState = Immutable(baseState);

const setSubsetsReducer = (state = initialState, action: SubsetsActions) => {
  switch (action.type) {
    case FETCH_SUBSETS:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], true)
        .setIn(['api', 'fetchSubsets', 'error'], undefined);
    case FETCH_SUBSETS_SUCCESS:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], false)
        .setIn(['api', 'fetchSubsets', 'error'], undefined)
        .setIn(['subsets'], action.subsets);
    case FETCH_SUBSETS_ERROR:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], false)
        .setIn(['api', 'fetchSubsets', 'error'], action.error);
    case ADD_SUBSETS:
      return state
        .update('subsets', (subsets) => [...subsets, ...action.subsets])
        .setIn(['api', 'addSubset', 'pending'], true)
        .setIn(['api', 'addSubset', 'error'], undefined);
    case ADD_SUBSETS_SUCCESS:
      return state
        .setIn(['api', 'addSubset', 'pending'], false)
        .setIn(['api', 'addSubset', 'error'], undefined);
    case ADD_SUBSETS_ERROR:
      return state
        .setIn(['api', 'addSubset', 'pending'], false)
        .setIn(['api', 'addSubset', 'error'], action.error);
    case REMOVE_SUBSET:
      return state
        .update('subsets', (subsets) => subsets.filter((subset) => subset.Id !== action.subset.Id))
        .setIn(['api', 'removeSubset', 'pending'], true)
        .setIn(['api', 'removeSubset', 'error'], undefined);
    case REMOVE_SUBSET_SUCCESS:
      return state
        .setIn(['api', 'removeSubset', 'pending'], false)
        .setIn(['api', 'removeSubset', 'error'], undefined);
    case REMOVE_SUBSET_ERROR:
      return state
        .setIn(['api', 'removeSubset', 'pending'], false)
        .setIn(['api', 'removeSubset', 'error'], action.error);
    case SET_FILTER:
      return state.set('filter', action.filter);
    default:
      return state;
  }
};

export default setSubsetsReducer;