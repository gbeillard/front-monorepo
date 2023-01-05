import {
  Property,
  FetchDictionaryAction,
  FetchDictionarySuccessAction,
  FetchDictionaryErrorAction,
  SetFilterAction,
  SetSortByAction,
  SetSortOrderAction,
  FETCH_DICTIONARY,
  FETCH_DICTIONARY_SUCCESS,
  FETCH_DICTIONARY_ERROR,
  SET_FILTER,
  IncreaseVisibleCountAction,
  INCREASE_VISIBLE_COUNT,
  ToggleSelectAllPropertiesAction,
  ToggleSelectPropertyAction,
  SELECT_PROPERTY,
  SELECT_ALL_PROPERTIES,
  SET_SORTBY,
  SET_SORTORDER,
  AddOfficialPropertiesAction,
  ADD_OFFICIAL_PROPERTIES,
  AddOfficialPropertiesSuccessAction,
  ADD_OFFICIAL_PROPERTIES_SUCCESS,
  AddOfficialPropertiesErrorAction,
  ADD_OFFICIAL_PROPERTIES_ERROR,
  DuplicatedProperty,
  DuplicatePropertyAction,
  DUPLICATE_PROPERTY,
  DuplicatePropertySuccessAction,
  DUPLICATE_PROPERTY_SUCCESS,
  DuplicatePropertyErrorAction,
  DUPLICATE_PROPERTY_ERROR,
} from './types';

export const fetchDictionary = (): FetchDictionaryAction => ({
  type: FETCH_DICTIONARY,
});

export const fetchDictionarySuccess = (properties: Property[]): FetchDictionarySuccessAction => ({
  type: FETCH_DICTIONARY_SUCCESS,
  properties,
});

export const fetchDictionaryError = (error: string): FetchDictionaryErrorAction => ({
  type: FETCH_DICTIONARY_ERROR,
  error,
});

export const setFilter = (filter: string): SetFilterAction => ({
  type: SET_FILTER,
  filter,
});

export const setSortBy = (sortBy: string): SetSortByAction => ({
  type: SET_SORTBY,
  sortBy,
});
export const setSortOrder = (sortOrder: string): SetSortOrderAction => ({
  type: SET_SORTORDER,
  sortOrder,
});

export const increaseVisibleCount = (): IncreaseVisibleCountAction => ({
  type: INCREASE_VISIBLE_COUNT,
});

export const selectProperty = (Id: number): ToggleSelectPropertyAction => ({
  type: SELECT_PROPERTY,
  Id,
});

export const selectAllProperties = (selected: boolean): ToggleSelectAllPropertiesAction => ({
  type: SELECT_ALL_PROPERTIES,
  selected,
});

export const addOfficialProperties = (properties: Property[]): AddOfficialPropertiesAction => ({
  type: ADD_OFFICIAL_PROPERTIES,
  properties,
});

export const addOfficialPropertiesSuccess = (): AddOfficialPropertiesSuccessAction => ({
  type: ADD_OFFICIAL_PROPERTIES_SUCCESS,
});

export const addOfficialPropertiesError = (error: Error): AddOfficialPropertiesErrorAction => ({
  type: ADD_OFFICIAL_PROPERTIES_ERROR,
  error,
});

export const duplicateProperty = (property: DuplicatedProperty): DuplicatePropertyAction => ({
  type: DUPLICATE_PROPERTY,
  property,
});

export const duplicatePropertySuccess = (): DuplicatePropertySuccessAction => ({
  type: DUPLICATE_PROPERTY_SUCCESS,
});

export const duplicatePropertyError = (error: Error): DuplicatePropertyErrorAction => ({
  type: DUPLICATE_PROPERTY_ERROR,
  error,
});