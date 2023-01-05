import Immutable from 'seamless-immutable';
import {
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_ERROR,
  UPDATE_PROPERTY,
  UPDATE_PROPERTY_SUCCESS,
  UPDATE_PROPERTY_ERROR,
  DELETE_PROPERTY,
  DELETE_PROPERTY_SUCCESS,
  DELETE_PROPERTY_ERROR,
  ADD_PROPERTIES,
  ADD_PROPERTIES_SUCCESS,
  ADD_PROPERTIES_ERROR,
  NodePropertyActions,
  NodeProperty,
  SET_FILTER,
} from './types';

import { SubsetsActions, ADD_SUBSET, REMOVE_SUBSET } from './subsets/types';

export const baseState = {
  api: {
    fetch: {
      payload: null,
      pending: false,
      error: null,
    },
  },
  properties: [] as NodeProperty[],
  filter: {
    text: '',
    setId: null as number,
    domainId: null as number,
  },
};

const initialState = Immutable(baseState);

const classificationsReducer = (
  state = initialState,
  action: NodePropertyActions | SubsetsActions
) => {
  switch (action.type) {
    case FETCH_PROPERTIES:
      return state.setIn(['api', 'fetch', 'pending'], true).setIn(['api', 'fetch', 'error'], null);

    case FETCH_PROPERTIES_SUCCESS:
      return state
        .setIn(['properties'], action.properties)
        .setIn(['api', 'fetch', 'pending'], false)
        .setIn(['api', 'fetch', 'error'], null);

    case FETCH_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'fetch', 'error'], action.error)
        .setIn(['api', 'fetch', 'pending'], false);

    case ADD_PROPERTIES:
      return state
        .update('properties', (properties) => [...properties, ...action.properties])
        .setIn(['api', 'add', 'pending'], true)
        .setIn(['api', 'add', 'error'], null);

    case ADD_PROPERTIES_SUCCESS:
      return state.setIn(['api', 'add', 'error'], null).setIn(['api', 'add', 'pending'], null);

    case ADD_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'add', 'error'], action.error)
        .setIn(['api', 'add', 'pending'], false);

    case UPDATE_PROPERTY: {
      const propertyIndex = state.properties.findIndex(
        (existingProp) => existingProp.Id === action.property.Id
      );
      return state
        .setIn(['properties', propertyIndex], action.property)
        .setIn(['api', 'update', 'pending'], false)
        .setIn(['api', 'update', 'error'], null);
    }

    case UPDATE_PROPERTY_SUCCESS:
      return state
        .setIn(['api', 'update', 'error'], null)
        .setIn(['api', 'update', 'pending'], null);

    case UPDATE_PROPERTY_ERROR:
      return state
        .setIn(['api', 'update', 'error'], action.error)
        .setIn(['api', 'update', 'pending'], false);

    case DELETE_PROPERTY:
      return state
        .update('properties', (properties) =>
          properties.filter((existingProperty) => existingProperty.Id !== action.property.Id)
        )
        .setIn(['api', 'delete', 'pending'], true)
        .setIn(['api', 'delete', 'error'], null);

    case DELETE_PROPERTY_SUCCESS:
      return state
        .setIn(['api', 'delete', 'error'], null)
        .setIn(['api', 'delete', 'pending'], false);

    case DELETE_PROPERTY_ERROR:
      return state
        .setIn(['api', 'delete', 'error'], action.error)
        .setIn(['api', 'delete', 'pending'], false);

    case ADD_SUBSET: {
      const propertyIndex = state.properties.findIndex(
        (property) => property.Id === action.property.Id
      );
      return state.updateIn(['properties', propertyIndex.toString(), 'Subsets'], (subsets) => [
        ...subsets,
        action.subset,
      ]);
    }

    case REMOVE_SUBSET: {
      const propertyIndex = state.properties.findIndex(
        (property) => property.Id === action.property.Id
      );
      return state.updateIn(['properties', propertyIndex, 'Subsets'], (subsets) =>
        subsets.filter((subset) => subset.Id !== action.subset.Id)
      );
    }

    case SET_FILTER:
      return state.set('filter', action.filter);

    default:
      return state;
  }
};

export default classificationsReducer;