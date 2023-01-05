import Immutable from 'seamless-immutable';
import {
  Property,
  FETCH_DICTIONARY_SUCCESS,
  DictionaryActions,
  SET_FILTER,
  SET_SORTBY,
  SET_SORTORDER,
  INCREASE_VISIBLE_COUNT,
  SELECT_PROPERTY,
  SELECT_ALL_PROPERTIES,
  ADD_OFFICIAL_PROPERTIES,
  ADD_OFFICIAL_PROPERTIES_SUCCESS,
  ADD_OFFICIAL_PROPERTIES_ERROR,
  DUPLICATE_PROPERTY,
  DUPLICATE_PROPERTY_SUCCESS,
  DUPLICATE_PROPERTY_ERROR,
} from './types';
import { getFilteredProperties, setPropertiesSelect } from './utils';

const VISIBLE_COUNT_STEP = 20;

export const baseState = {
  properties: [] as Property[],
  filter: '',
  sortBy: '',
  sortOrder: '',
  visibleCount: VISIBLE_COUNT_STEP,
  api: {
    addOfficialProperties: {
      pending: false,
      success: false,
      error: undefined,
    },
    duplicateProperty: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
};

const initialState = Immutable(baseState);

const dictionaryReducer = (state = initialState, action: DictionaryActions) => {
  switch (action.type) {
    case FETCH_DICTIONARY_SUCCESS:
      return state.set('properties', action.properties);
    case SET_FILTER:
      return state.set('filter', action.filter);
    case SET_SORTBY:
      return state.set('sortBy', action.sortBy);
    case SET_SORTORDER:
      return state.set('sortOrder', action.sortOrder);
    case INCREASE_VISIBLE_COUNT:
      return state.update('visibleCount', (count) => count + VISIBLE_COUNT_STEP);
    case SELECT_PROPERTY:
      const index = state.properties.findIndex((p) => p.Id === action.Id);
      return state.updateIn(['properties', index, 'selected'], (selected) => !selected);
    case SELECT_ALL_PROPERTIES:
      const selectedIds = getFilteredProperties(
        state.properties as unknown as Property[],
        state.filter,
        state.sortBy,
        state.sortOrder
      ).map((property) => property.Id);
      return state.update('properties', (properties) =>
        setPropertiesSelect(properties, action.selected, selectedIds)
      );
    case ADD_OFFICIAL_PROPERTIES:
      return state
        .setIn(['api', 'addOfficialProperties', 'pending'], true)
        .setIn(['api', 'addOfficialProperties', 'success'], false)
        .setIn(['api', 'addOfficialProperties', 'error'], undefined);
    case ADD_OFFICIAL_PROPERTIES_SUCCESS:
      return state
        .setIn(['api', 'addOfficialProperties', 'pending'], false)
        .setIn(['api', 'addOfficialProperties', 'success'], true)
        .setIn(['api', 'addOfficialProperties', 'error'], undefined);
    case ADD_OFFICIAL_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'addOfficialProperties', 'pending'], false)
        .setIn(['api', 'addOfficialProperties', 'success'], false)
        .setIn(['api', 'addOfficialProperties', 'error'], action.error);
    case DUPLICATE_PROPERTY:
      return state
        .setIn(['api', 'duplicateProperty', 'pending'], true)
        .setIn(['api', 'duplicateProperty', 'success'], false)
        .setIn(['api', 'duplicateProperty', 'error'], undefined);
    case DUPLICATE_PROPERTY_SUCCESS:
      return state
        .setIn(['api', 'duplicateProperty', 'pending'], false)
        .setIn(['api', 'duplicateProperty', 'success'], true)
        .setIn(['api', 'duplicateProperty', 'error'], undefined);
    case DUPLICATE_PROPERTY_ERROR:
      return state
        .setIn(['api', 'duplicateProperty', 'pending'], false)
        .setIn(['api', 'duplicateProperty', 'success'], false)
        .setIn(['api', 'duplicateProperty', 'error'], action.error);
    default:
      return state;
  }
};

export default dictionaryReducer;