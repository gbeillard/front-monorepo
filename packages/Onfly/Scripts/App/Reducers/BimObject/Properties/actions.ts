import {
  Property,
  Filter,
  FETCH_PROPERTIES,
  FetchPropertiesAction,
  FETCH_PROPERTIES_SUCCESS,
  FetchPropertiesSuccessAction,
  FETCH_PROPERTIES_ERROR,
  FetchPropertiesErrorAction,
  SET_FILTER,
  SetFilterAction,
  DELETE_PROPERTY,
  DeletePropertyAction,
  DELETE_PROPERTY_SUCCESS,
  DeletePropertySuccessAction,
  DELETE_PROPERTY_ERROR,
  DeletePropertyErrorAction,
  ADD_PROPERTIES,
  AddPropertiesAction,
  ADD_PROPERTIES_ERROR,
  AddPropertiesErrorAction,
  ADD_PROPERTIES_SUCCESS,
  AddPropertiesSuccessAction,
} from './types';

export const fetchProperties = (bimObjectId: number): FetchPropertiesAction => ({
  type: FETCH_PROPERTIES,
  bimObjectId,
});

export const fetchPropertiesSuccess = (properties: Property[]): FetchPropertiesSuccessAction => ({
  type: FETCH_PROPERTIES_SUCCESS,
  properties,
});

export const fetchPropertiesError = (error: string): FetchPropertiesErrorAction => ({
  type: FETCH_PROPERTIES_ERROR,
  error,
});

export const setFilter = (filter: Filter): SetFilterAction => ({
  type: SET_FILTER,
  filter,
});

export const deleteProperty = (bimObjectId: number, propertyId: number): DeletePropertyAction => ({
  type: DELETE_PROPERTY,
  bimObjectId,
  propertyId,
});

export const deletePropertySuccess = (): DeletePropertySuccessAction => ({
  type: DELETE_PROPERTY_SUCCESS,
});

export const deletePropertyError = (error: string): DeletePropertyErrorAction => ({
  type: DELETE_PROPERTY_ERROR,
  error,
});

export const addProperties = (
  bimObjectId: number,
  properties: Property[]
): AddPropertiesAction => ({
  type: ADD_PROPERTIES,
  bimObjectId,
  properties,
});

export const addPropertiesSuccess = (): AddPropertiesSuccessAction => ({
  type: ADD_PROPERTIES_SUCCESS,
});

export const addPropertiesError = (error: string): AddPropertiesErrorAction => ({
  type: ADD_PROPERTIES_ERROR,
  error,
});