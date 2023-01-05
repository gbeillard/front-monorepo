import Immutable from 'seamless-immutable';
import {
  Property,
  PropertiesActions,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_ERROR,
  SET_FILTER,
  DELETE_PROPERTY,
  DELETE_PROPERTY_SUCCESS,
  DELETE_PROPERTY_ERROR,
  ADD_PROPERTIES,
  ADD_PROPERTIES_SUCCESS,
  ADD_PROPERTIES_ERROR,
} from './types';

import {
  SubsetsActions as PropertiesSubsetsActions,
  ADD_SUBSET,
  REMOVE_SUBSET,
} from './Subsets/types';

import { SubsetsActions } from '../Subsets/types';

import { propertiesHasSet } from './utils';

export const baseState = {
  api: {
    fetchProperties: {
      pending: false,
      success: false,
      error: undefined,
    },
    deleteProperty: {
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
  properties: [] as Property[],
  filter: {
    text: '',
    setId: null as number,
    domainId: null as number,
  },
};

const initialState = Immutable(baseState);

const bimObjectPropertiesReducer = (
  state = initialState,
  action: PropertiesActions | PropertiesSubsetsActions | SubsetsActions
) => {
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
    case SET_FILTER:
      return state.set('filter', action.filter);
    case DELETE_PROPERTY:
      // If the domain of the deleted property is use in the filter
      let { filter } = state;
      const domain = state.properties?.find(
        (property) => property?.Id === action.propertyId
      )?.Domain;
      const isLastDomain =
        state.properties?.filter((property) => property?.Domain?.Id === domain?.Id)?.length <= 1;

      if (domain && filter?.domainId && isLastDomain && filter?.domainId === domain?.Id) {
        filter = {
          ...filter,
          domainId: null,
        };
      }

      const updatedState = state.update('properties', (properties) =>
        properties.filter((existingProperty) => existingProperty.Id !== action.propertyId)
      );

      // Reset set filter when properties no longer have the set define in the filter
      if (filter?.setId && !propertiesHasSet(updatedState?.properties, filter?.setId)) {
        filter = {
          ...filter,
          setId: null,
        };
      }

      return updatedState
        .set('filter', filter)
        .setIn(['api', 'deleteProperty', 'pending'], true)
        .setIn(['api', 'deleteProperty', 'success'], false)
        .setIn(['api', 'deleteProperty', 'error'], undefined);
    case DELETE_PROPERTY_SUCCESS:
      return state
        .setIn(['api', 'deleteProperty', 'pending'], false)
        .setIn(['api', 'deleteProperty', 'success'], true)
        .setIn(['api', 'deleteProperty', 'error'], undefined);
    case DELETE_PROPERTY_ERROR:
      return state
        .setIn(['api', 'deleteProperty', 'pending'], false)
        .setIn(['api', 'deleteProperty', 'success'], false)
        .setIn(['api', 'deleteProperty', 'error'], action.error);
    case ADD_PROPERTIES:
      return state
        .update('properties', (properties) => [...properties, ...action.properties])
        .setIn(['api', 'addProperties', 'pending'], true)
        .setIn(['api', 'addProperties', 'success'], false)
        .setIn(['api', 'addProperties', 'error'], undefined);
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
    case ADD_SUBSET: {
      if (action.property == null) {
        return state;
      }

      const propertyIndex = state.properties.findIndex(
        (property) => property?.Id === action.property.Id
      );
      return state.updateIn(['properties', propertyIndex.toString(), 'Subsets'], (subsets) => [
        ...subsets,
        action.subset,
      ]);
    }

    case REMOVE_SUBSET: {
      if (action.property == null || action.subset == null) {
        return state;
      }

      const propertyIndex = state.properties.findIndex(
        (property) => property?.Id === action.property.Id
      );
      const updatedState = state.updateIn(['properties', propertyIndex, 'Subsets'], (subsets) =>
        subsets.filter((subset) => subset?.Id !== action.subset.Id)
      );

      // Reset set filter when properties no longer have the set define in the filter
      let propertiesFilter = state.filter;

      if (
        propertiesFilter?.setId &&
        !propertiesHasSet(updatedState?.properties, propertiesFilter?.setId)
      ) {
        propertiesFilter = {
          ...propertiesFilter,
          setId: null,
        };
      }

      return updatedState.set('filter', propertiesFilter);
    }
    default:
      return state;
  }
};

export default bimObjectPropertiesReducer;