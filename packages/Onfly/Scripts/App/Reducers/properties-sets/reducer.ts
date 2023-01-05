import Immutable from 'seamless-immutable';
import { SortDirection } from '@bim-co/componentui-foundation';
import {
  SET_PROPERTIES_SETS,
  SET_FILTER,
  SET_API_STATE,
  SET_SORT_ORDER_BY,
  SET_SORT_DIRECTION,
  FETCH_SET,
  FETCH_SET_SUCCESS,
  FETCH_SET_ERROR,
  FETCH_SETS,
  FETCH_SETS_SUCCESS,
  FETCH_SETS_ERROR,
} from './constants';
import { ObjectsActions, Set } from './types';

const initialState = Immutable({
  propertiesSets: [],
  propertiesSet: null as Set,
  filter: {
    text: '',
  },
  sortOrderBy: '',
  sortDirection: SortDirection.Asc,
  apiState: {
    fetch: {
      completed: false,
    },
    fetchSet: {
      pending: false,
      success: false,
      error: undefined,
    },
    fetchSets: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
});

const propertiesSetsReducer = (state = initialState, action: ObjectsActions) => {
  switch (action.type) {
    case SET_PROPERTIES_SETS:
      return state.set('propertiesSets', action.propertiesSets);
    case SET_FILTER:
      return state.set('filter', action.filter);
    case SET_API_STATE:
      return state.set('apiState', action.apiState);
    case SET_SORT_ORDER_BY:
      return state.set('sortOrderBy', action.sortOrderBy);
    case SET_SORT_DIRECTION:
      return state.set('sortDirection', action.sortDirection);
    case FETCH_SET:
      return state
        .setIn(['apiState', 'fetchSet', 'pending'], true)
        .setIn(['apiState', 'fetchSet', 'success'], false)
        .setIn(['apiState', 'fetchSet', 'error'], undefined);
    case FETCH_SET_SUCCESS:
      return state
        .setIn(['apiState', 'fetchSet', 'pending'], false)
        .setIn(['apiState', 'fetchSet', 'success'], true)
        .setIn(['apiState', 'fetchSet', 'error'], undefined)
        .setIn(['propertiesSet'], action.set);
    case FETCH_SET_ERROR:
      return state
        .setIn(['apiState', 'fetchSet', 'pending'], false)
        .setIn(['apiState', 'fetchSet', 'success'], false)
        .setIn(['apiState', 'fetchSet', 'error'], action.error);
    case FETCH_SETS:
      return state
        .setIn(['apiState', 'fetchSets', 'pending'], true)
        .setIn(['apiState', 'fetchSets', 'success'], false)
        .setIn(['apiState', 'fetchSets', 'error'], undefined);
    case FETCH_SETS_SUCCESS:
      return state
        .setIn(['apiState', 'fetchSets', 'pending'], false)
        .setIn(['apiState', 'fetchSets', 'success'], true)
        .setIn(['apiState', 'fetchSets', 'error'], undefined)
        .setIn(['propertiesSets'], action.sets);
    case FETCH_SETS_ERROR:
      return state
        .setIn(['apiState', 'fetchSets', 'pending'], false)
        .setIn(['apiState', 'fetchSets', 'success'], false)
        .setIn(['apiState', 'fetchSets', 'error'], action.error);
    default:
      return state;
  }
};

export default propertiesSetsReducer;