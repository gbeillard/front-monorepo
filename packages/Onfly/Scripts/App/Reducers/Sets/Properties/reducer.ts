import Immutable from 'seamless-immutable';

import { SortDirection } from '@bim-co/componentui-foundation';
import {
  PropertiesActions,
  Property,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_ERROR,
  SET_FILTER_SEARCH,
  SET_FILTER_SORT,
  EDIT_PROPERTIES,
  UPDATE_PROPERTY_SUBSETS,
  UPDATE_PROPERTY_SUBSETS_SUCCESS,
  UPDATE_PROPERTY_SUBSETS_ERROR,
  DELETE_PROPERTIES,
  DELETE_PROPERTIES_SUCCESS,
  DELETE_PROPERTIES_ERROR,
  ADD_PROPERTIES,
  ADD_PROPERTIES_SUCCESS,
  ADD_PROPERTIES_ERROR,
  Domain,
  SET_FILTER_DOMAIN,
  PropertySubsetsError,
} from './types';

import { editProperties, deleteProperties } from './utils';

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
      error: undefined as PropertySubsetsError,
    },
    deleteProperties: {
      pending: false,
      success: false,
      error: undefined,
    },
    addProperties: {
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

const setPropertiesReducer = (state = initialState, action: PropertiesActions) => {
  switch (action.type) {
    case FETCH_PROPERTIES:
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
    case EDIT_PROPERTIES:
      const newProperties = editProperties(state.properties, action.properties);
      return state.setIn(['properties'], newProperties);
    case UPDATE_PROPERTY_SUBSETS:
      return state
        .setIn(['api', 'updatePropertySubsets', 'pending'], true)
        .setIn(['api', 'updatePropertySubsets', 'success'], false)
        .setIn(['api', 'updatePropertySubsets', 'error'], undefined);
    case UPDATE_PROPERTY_SUBSETS_SUCCESS:
      return state
        .setIn(['api', 'updatePropertySubsets', 'pending'], false)
        .setIn(['api', 'updatePropertySubsets', 'success'], true)
        .setIn(['api', 'updatePropertySubsets', 'error'], undefined);
    case UPDATE_PROPERTY_SUBSETS_ERROR:
      return state
        .setIn(['api', 'updatePropertySubsets', 'pending'], false)
        .setIn(['api', 'updatePropertySubsets', 'success'], false)
        .setIn(['api', 'updatePropertySubsets', 'error'], {
          message: action.error,
          propertyId: action.propertyId,
        } as PropertySubsetsError);
    case DELETE_PROPERTIES:
      return state
        .setIn(['properties'], deleteProperties(state.properties, action.properties))
        .setIn(['api', 'deleteProperties', 'pending'], true)
        .setIn(['api', 'deleteProperties', 'success'], false)
        .setIn(['api', 'deleteProperties', 'error'], undefined);
    case DELETE_PROPERTIES_SUCCESS:
      return state
        .setIn(['api', 'deleteProperties', 'pending'], false)
        .setIn(['api', 'deleteProperties', 'success'], true)
        .setIn(['api', 'deleteProperties', 'error'], undefined);
    case DELETE_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'deleteProperties', 'pending'], false)
        .setIn(['api', 'deleteProperties', 'success'], false)
        .setIn(['api', 'deleteProperties', 'error'], action.error);
    case ADD_PROPERTIES:
      // => Ordonner les propriétés
      return state
        .update('properties', (properties) => [...properties, ...action.properties])
        .setIn(['api', 'addProperties', 'pending'], true)
        .setIn(['api', 'addProperties', 'success'], false)
        .setIn(['api', 'addProperties', 'error'], null);
    case ADD_PROPERTIES_SUCCESS:
      return state
        .setIn(['api', 'addProperties', 'pending'], false)
        .setIn(['api', 'addProperties', 'success'], true)
        .setIn(['api', 'addProperties', 'error'], undefined);
    case ADD_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'addProperties', 'pending'], false)
        .setIn(['api', 'addProperties', 'success'], false)
        .setIn(['api', 'addProperties', 'error'], action.error);
    default:
      return state;
  }
};

export default setPropertiesReducer;