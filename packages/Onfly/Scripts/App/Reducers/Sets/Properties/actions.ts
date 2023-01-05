import { SortDirection } from '@bim-co/componentui-foundation';
import {
  Property,
  FETCH_PROPERTIES,
  FetchPropertiesAction,
  AddPropertiesAction,
  ADD_PROPERTIES,
  AddPropertiesSuccessAction,
  ADD_PROPERTIES_SUCCESS,
  AddPropertiesErrorAction,
  ADD_PROPERTIES_ERROR,
  FETCH_PROPERTIES_SUCCESS,
  FetchPropertiesSuccessAction,
  FETCH_PROPERTIES_ERROR,
  FetchPropertiesErrorAction,
  SET_FILTER_SEARCH,
  SetFilterSearch,
  SET_FILTER_SORT,
  SetFilterSort,
  EDIT_PROPERTIES,
  EditPropertiesAction,
  UPDATE_PROPERTY_SUBSETS,
  UpdatePropertySubsetsAction,
  UPDATE_PROPERTY_SUBSETS_SUCCESS,
  UpdatePropertySubsetsSuccessAction,
  UPDATE_PROPERTY_SUBSETS_ERROR,
  UpdatePropertySubsetsErrorAction,
  DELETE_PROPERTIES,
  DeletePropertiesAction,
  DELETE_PROPERTIES_SUCCESS,
  DeletePropertiesSuccessAction,
  DELETE_PROPERTIES_ERROR,
  DeletePropertiesErrorAction,
  SET_FILTER_DOMAIN,
  SetFilterDomainAction,
  Domain,
} from './types';
import { Subset } from '../Subsets/types';

/* API */

export const fetchProperties = (setId: number): FetchPropertiesAction => ({
  type: FETCH_PROPERTIES,
  setId,
});

export const fetchPropertiesSuccess = (properties: Property[]): FetchPropertiesSuccessAction => ({
  type: FETCH_PROPERTIES_SUCCESS,
  properties,
});

export const fetchPropertiesError = (error: string): FetchPropertiesErrorAction => ({
  type: FETCH_PROPERTIES_ERROR,
  error,
});

export const addProperties = (setId: number, properties: Property[]): AddPropertiesAction => ({
  type: ADD_PROPERTIES,
  setId,
  properties,
});

export const addPropertiesSuccess = (): AddPropertiesSuccessAction => ({
  type: ADD_PROPERTIES_SUCCESS,
});

export const addPropertiesError = (error: string): AddPropertiesErrorAction => ({
  type: ADD_PROPERTIES_ERROR,
  error,
});

export const updatePropertySubsets = (
  setId: number,
  propertyId: number,
  subsets: Subset[],
  keepPropertiesWithValue?: boolean
): UpdatePropertySubsetsAction => ({
  type: UPDATE_PROPERTY_SUBSETS,
  setId,
  propertyId,
  subsets,
  keepPropertiesWithValue,
});

export const updatePropertySubsetsSuccess = (): UpdatePropertySubsetsSuccessAction => ({
  type: UPDATE_PROPERTY_SUBSETS_SUCCESS,
});

export const updatePropertySubsetsError = (
  error: string,
  propertyId: number
): UpdatePropertySubsetsErrorAction => ({
  type: UPDATE_PROPERTY_SUBSETS_ERROR,
  error,
  propertyId,
});

export const deleteProperties = (
  setId: number,
  properties: Property[],
  keepPropertiesWithValue?: boolean
): DeletePropertiesAction => ({
  type: DELETE_PROPERTIES,
  setId,
  properties,
  keepPropertiesWithValue,
});

export const deletePropertiesSuccess = (): DeletePropertiesSuccessAction => ({
  type: DELETE_PROPERTIES_SUCCESS,
});

export const deletePropertiesError = (error: string): DeletePropertiesErrorAction => ({
  type: DELETE_PROPERTIES_ERROR,
  error,
});

/* Filter */

export const setFilterSearch = (search: string): SetFilterSearch => ({
  type: SET_FILTER_SEARCH,
  search,
});

export const setFilterSort = (field: string, order: SortDirection): SetFilterSort => ({
  type: SET_FILTER_SORT,
  field,
  order,
});

export const setFilterDomain = (domain: Domain): SetFilterDomainAction => ({
  type: SET_FILTER_DOMAIN,
  domain,
});

/* Edit properties */

export const editProperties = (properties: Property[]): EditPropertiesAction => ({
  type: EDIT_PROPERTIES,
  properties,
});