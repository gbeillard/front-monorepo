import { SortDirection } from '@bim-co/componentui-foundation';

import { Subset } from '../Subsets/types';

export const FETCH_PROPERTIES = 'SETS/PROPERTIES/FETCH_PROPERTIES';
export const FETCH_ALL_PROPERTIES = 'SETS/PROPERTIES/FETCH_ALL_PROPERTIES';
export const FETCH_PROPERTIES_SUCCESS = 'SETS/PROPERTIES/FETCH_PROPERTIES_SUCCESS';
export const FETCH_PROPERTIES_ERROR = 'SETS/PROPERTIES/FETCH_PROPERTIES_ERROR';

export const ADD_PROPERTIES = 'SETS/PROPERTIES/ADD_PROPERTIES';
export const ADD_PROPERTIES_SUCCESS = 'SETS/PROPERTIES/ADD_PROPERTIES_SUCCESS';
export const ADD_PROPERTIES_ERROR = 'SETS/PROPERTIES/ADD_PROPERTIES_ERROR';

export const SET_FILTER_SEARCH = 'SETS/PROPERTIES/SET_FILTER_SEARCH';
export const SET_FILTER_SORT = 'SETS/PROPERTIES/SET_FILTER_SORT';
export const SET_FILTER_TEXT = 'SETS/PROPERTIES/SET_FILTER_TEXT';
export const SET_FILTER_DOMAIN = 'SETS/PROPERTIES/SET_FILTER_DOMAIN';

export const EDIT_PROPERTIES = 'SETS/PROPERTIES/EDIT_PROPERTIES';
export const UPDATE_PROPERTY_SUBSETS = 'SETS/PROPERTIES/UPDATE_PROPERTY_SUBSETS';
export const UPDATE_PROPERTY_SUBSETS_SUCCESS = 'SETS/PROPERTIES/UPDATE_PROPERTY_SUBSETS_SUCCESS';
export const UPDATE_PROPERTY_SUBSETS_ERROR = 'SETS/PROPERTIES/UPDATE_PROPERTY_SUBSETS_ERROR';
export const DELETE_PROPERTIES = 'SETS/PROPERTIES/DELETE_PROPERTIES';
export const DELETE_PROPERTIES_SUCCESS = 'SETS/PROPERTIES/DELETE_PROPERTIES_SUCCESS';
export const DELETE_PROPERTIES_ERROR = 'SETS/PROPERTIES/DELETE_PROPERTIES_ERROR';

export type FilterSort = {
  field: string;
  order: SortDirection;
};

/*
    Models
*/

export type Property = {
  Id: number;
  Name: string;
  Domain?: Domain;
  DefaultUnit?: Unit;
  Subsets?: Subset[];
  Description?: string;
};

export type Domain = {
  Id: number;
  Name: string;
};

export type Unit = {
  Id: number;
  Symbol: string;
};

/*
    Actions
*/

/* API */

export type FetchPropertiesAction = {
  type: typeof FETCH_PROPERTIES;
  setId: number;
};

export type FetchPropertiesSuccessAction = {
  type: typeof FETCH_PROPERTIES_SUCCESS;
  properties: Property[];
};

export type FetchPropertiesErrorAction = {
  type: typeof FETCH_PROPERTIES_ERROR;
  error: string;
};

export type AddPropertiesAction = {
  type: typeof ADD_PROPERTIES;
  setId: number;
  properties: Property[];
};

export type AddPropertiesSuccessAction = {
  type: typeof ADD_PROPERTIES_SUCCESS;
};

export type AddPropertiesErrorAction = {
  type: typeof ADD_PROPERTIES_ERROR;
  error: string;
};
export type UpdatePropertySubsetsAction = {
  type: typeof UPDATE_PROPERTY_SUBSETS;
  setId: number;
  propertyId: number;
  subsets: Subset[];
  keepPropertiesWithValue?: boolean;
};

export type UpdatePropertySubsetsSuccessAction = {
  type: typeof UPDATE_PROPERTY_SUBSETS_SUCCESS;
};

export type UpdatePropertySubsetsErrorAction = {
  type: typeof UPDATE_PROPERTY_SUBSETS_ERROR;
  error: string;
  propertyId: number;
};

export type DeletePropertiesAction = {
  type: typeof DELETE_PROPERTIES;
  setId: number;
  properties: Property[];
  keepPropertiesWithValue?: boolean;
};

export type DeletePropertiesSuccessAction = {
  type: typeof DELETE_PROPERTIES_SUCCESS;
};

export type DeletePropertiesErrorAction = {
  type: typeof DELETE_PROPERTIES_ERROR;
  error: string;
};

/* Filter */

export type SetFilterSearch = {
  type: typeof SET_FILTER_SEARCH;
  search: string;
};

export type SetFilterSort = {
  type: typeof SET_FILTER_SORT;
  field: string;
  order: SortDirection;
};

export type SetFilterDomainAction = {
  type: typeof SET_FILTER_DOMAIN;
  domain: Domain;
};

/* Edit properties */

export type EditPropertiesAction = {
  type: typeof EDIT_PROPERTIES;
  properties: Property[];
};

/* Reducer */

export type PropertySubsetsError = {
  message: string;
  propertyId: number;
};

export type PropertiesActions =
  | FetchPropertiesAction
  | FetchPropertiesSuccessAction
  | FetchPropertiesErrorAction
  | AddPropertiesAction
  | AddPropertiesSuccessAction
  | AddPropertiesErrorAction
  | SetFilterSearch
  | SetFilterSort
  | SetFilterDomainAction
  | EditPropertiesAction
  | UpdatePropertySubsetsAction
  | UpdatePropertySubsetsSuccessAction
  | UpdatePropertySubsetsErrorAction
  | DeletePropertiesAction
  | DeletePropertiesSuccessAction
  | DeletePropertiesErrorAction;