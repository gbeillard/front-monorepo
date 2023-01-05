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
  UPDATE_PROPERTIES,
  UPDATE_PROPERTIES_SUCCESS,
  UPDATE_PROPERTIES_ERROR,
  ADD_PROPERTIES,
  ADD_PROPERTIES_SUCCESS,
  ADD_PROPERTIES_ERROR,
  FetchPropertiesAction,
  NodeProperty,
  UpdatePropertyAction,
  UpdatePropertySuccessAction,
  UpdatePropertyErrorAction,
  AddPropertiesAction,
  AddPropertiesSuccessAction,
  AddPropertiesErrorAction,
  FetchPropertiesSuccessAction,
  FetchPropertiesErrorAction,
  SetFilterAction,
  SET_FILTER,
  Filter,
} from './types';

export const fetchProperties = (
  classificationId: number,
  nodeId: number
): FetchPropertiesAction => ({
  type: FETCH_PROPERTIES,
  classificationId,
  nodeId,
});
export const fetchPropertiesSuccess = (properties): FetchPropertiesSuccessAction => ({
  type: FETCH_PROPERTIES_SUCCESS,
  properties,
});
export const fetchPropertiesError = (error): FetchPropertiesErrorAction => ({
  type: FETCH_PROPERTIES_ERROR,
  error,
});

export const addProperties = (
  classificationId: number,
  nodeId: number,
  properties: NodeProperty[]
): AddPropertiesAction => ({
  type: ADD_PROPERTIES,
  classificationId,
  nodeId,
  properties,
});
export const addPropertiesSuccess = (): AddPropertiesSuccessAction => ({
  type: ADD_PROPERTIES_SUCCESS,
});
export const addPropertiesError = (error: string): AddPropertiesErrorAction => ({
  type: ADD_PROPERTIES_ERROR,
  error,
});

export const updateProperty = (
  classificationId: number,
  nodeId: number,
  property: NodeProperty
): UpdatePropertyAction => ({
  type: UPDATE_PROPERTY,
  classificationId,
  nodeId,
  property,
});
export const updatePropertySuccess = (): UpdatePropertySuccessAction => ({
  type: UPDATE_PROPERTY_SUCCESS,
});
export const updatePropertyError = (error): UpdatePropertyErrorAction => ({
  type: UPDATE_PROPERTY_ERROR,
  error,
});

// delete current property
export const deleteProperty = (
  classificationId: number,
  nodeId: number,
  property: NodeProperty,
  keepPropertiesWithValue: boolean
) => ({
  type: DELETE_PROPERTY,
  classificationId,
  nodeId,
  property,
  keepPropertiesWithValue,
});
export const deletePropertySuccess = () => ({
  type: DELETE_PROPERTY_SUCCESS,
});
export const deletePropertyError = (error) => ({
  type: DELETE_PROPERTY_ERROR,
  error,
});

// update current node properties
export const updateCurrentProperty = (payload) => ({
  type: UPDATE_PROPERTIES,
  payload,
});
export const updateCurrentPropertySuccess = (response) => ({
  type: UPDATE_PROPERTIES_SUCCESS,
  response,
});
export const updateCurrentPropertyError = (error) => ({
  type: UPDATE_PROPERTIES_ERROR,
  error,
});

export const setFilter = (filter: Filter): SetFilterAction => ({
  type: SET_FILTER,
  filter,
});