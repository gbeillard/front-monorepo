import Immutable from 'seamless-immutable';
import {
  SubsetsActions,
  FETCH_SUBSETS,
  FETCH_SUBSETS_SUCCESS,
  FETCH_SUBSETS_ERROR,
  SET_FILTER,
  DELETE_SUBSET,
  DELETE_SUBSET_SUCCESS,
  DELETE_SUBSET_ERROR,
  ADD_SUBSETS,
  ADD_SUBSETS_SUCCESS,
  ADD_SUBSETS_ERROR,
} from './types';
import { Subset } from '../../Sets/Subsets/types';

export const baseState = {
  api: {
    fetchSubsets: {
      pending: false,
      success: false,
      error: undefined,
    },
    deleteSubset: {
      pending: false,
      success: false,
      error: undefined,
    },
    addSubsets: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
  subsets: [] as Subset[],
  filter: {
    text: '',
    setId: null as number,
    domainId: null as number,
  },
};

const initialState = Immutable(baseState);

const bimObjectSubsetsReducer = (state = initialState, action: SubsetsActions) => {
  switch (action.type) {
    case FETCH_SUBSETS:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], true)
        .setIn(['api', 'fetchSubsets', 'success'], false)
        .setIn(['api', 'fetchSubsets', 'error'], undefined);
    case FETCH_SUBSETS_SUCCESS:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], false)
        .setIn(['api', 'fetchSubsets', 'success'], true)
        .setIn(['api', 'fetchSubsets', 'error'], undefined)
        .setIn(['subsets'], action.subsets);
    case FETCH_SUBSETS_ERROR:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], false)
        .setIn(['api', 'fetchSubsets', 'success'], false)
        .setIn(['api', 'fetchSubsets', 'error'], action.error);
    case SET_FILTER:
      return state.set('filter', action.filter);
    case DELETE_SUBSET:
      // If the set of the deleted subset is use in the filter
      let { filter } = state;
      const set = state.subsets?.find((subset) => subset?.Id === action.subsetId)?.Set;
      const isLastSet = state.subsets?.filter((subset) => subset?.Set?.Id === set?.Id)?.length <= 1;

      if (set && filter?.setId && isLastSet && filter?.setId === set?.Id) {
        filter = {
          ...filter,
          setId: null,
        };
      }

      return state
        .update('subsets', (subsets) => subsets.filter((subset) => subset.Id !== action.subsetId))
        .set('filter', filter)
        .setIn(['api', 'deleteSubset', 'pending'], true)
        .setIn(['api', 'deleteSubset', 'success'], false)
        .setIn(['api', 'deleteSubset', 'error'], undefined);
    case DELETE_SUBSET_SUCCESS:
      return state
        .setIn(['api', 'deleteSubset', 'pending'], false)
        .setIn(['api', 'deleteSubset', 'success'], true)
        .setIn(['api', 'deleteSubset', 'error'], undefined);
    case DELETE_SUBSET_ERROR:
      return state
        .setIn(['api', 'deleteSubset', 'pending'], false)
        .setIn(['api', 'deleteSubset', 'success'], false)
        .setIn(['api', 'deleteSubset', 'error'], action.error);
    case ADD_SUBSETS:
      return state
        .update('subsets', (subsets) => [...subsets, ...action.subsets])
        .setIn(['api', 'addSubsets', 'pending'], true)
        .setIn(['api', 'addSubsets', 'success'], false)
        .setIn(['api', 'addSubsets', 'error'], undefined);
    case ADD_SUBSETS_SUCCESS:
      return state
        .setIn(['api', 'addSubsets', 'pending'], false)
        .setIn(['api', 'addSubsets', 'success'], true)
        .setIn(['api', 'addSubsets', 'error'], undefined);
    case ADD_SUBSETS_ERROR:
      return state
        .setIn(['api', 'addSubsets', 'pending'], false)
        .setIn(['api', 'addSubsets', 'success'], false)
        .setIn(['api', 'addSubsets', 'error'], action.error);
    default:
      return state;
  }
};

export default bimObjectSubsetsReducer;