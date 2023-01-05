import Immutable from 'seamless-immutable';

import { SortDirection } from '@bim-co/componentui-foundation';
import {
  PropertiesActions,
  Property,
  FETCH_ALL_PROPERTIES,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_ERROR,
  SET_FILTER_SEARCH,
  SET_FILTER_SORT,
  Domain,
  SET_FILTER_DOMAIN,
} from './types';

export const baseState = {
  api: {
    fetchProperties: {
      pending: false,
      success: false,
      error: undefined,
    },
    updatePropertySubsets: {
      pending: false,
      success: false,
      error: undefined,
    },
    deleteProperties: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
  filter: {
    search: '',
    sort: {
      field: '',
      order: SortDirection.Asc,
    },
    domain: null as Domain,
  },
  properties: [] as Property[],
};

const initialState = Immutable(baseState);

const propertiesV10Reducer = (state = initialState, action: PropertiesActions) => {
  switch (action.type) {
    case FETCH_ALL_PROPERTIES:
      return state
        .setIn(['api', 'fetchProperties', 'pending'], true)
        .setIn(['api', 'fetchProperties', 'success'], false)
        .setIn(['api', 'fetchProperties', 'error'], undefined);
    case FETCH_PROPERTIES_SUCCESS:
      return state
        .setIn(['api', 'fetchProperties', 'pending'], false)
        .setIn(['api', 'fetchProperties', 'success'], true)
        .setIn(['api', 'fetchProperties', 'error'], undefined)
        .setIn(['properties'], action.properties);
    case FETCH_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'fetchProperties', 'pending'], false)
        .setIn(['api', 'fetchProperties', 'success'], false)
        .setIn(['api', 'fetchProperties', 'error'], action.error);
    case SET_FILTER_SEARCH:
      return state.setIn(['filter', 'search'], action.search);
    case SET_FILTER_SORT:
      return state
        .setIn(['filter', 'sort', 'field'], action.field)
        .setIn(['filter', 'sort', 'order'], action.order);
    case SET_FILTER_DOMAIN:
      return state.setIn(['filter', 'domain'], action.domain);
    default:
      return state;
  }
};

export default propertiesV10Reducer;