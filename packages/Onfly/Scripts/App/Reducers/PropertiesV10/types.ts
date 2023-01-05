import { SortDirection } from '@bim-co/componentui-foundation';

import { Subset } from '../Sets/Subsets/types';

export const FETCH_ALL_PROPERTIES = 'PROPERTIESV10/FETCH_ALL_PROPERTIES';
export const FETCH_PROPERTIES_SUCCESS = 'PROPERTIESV10/FETCH_PROPERTIES_SUCCESS';
export const FETCH_PROPERTIES_ERROR = 'PROPERTIESV10/FETCH_PROPERTIES_ERROR';

export const SET_FILTER_SEARCH = 'PROPERTIESV10/SET_FILTER_SEARCH';
export const SET_FILTER_SORT = 'PROPERTIESV10/SET_FILTER_SORT';
export const SET_FILTER_TEXT = 'PROPERTIESV10/SET_FILTER_TEXT';
export const SET_FILTER_DOMAIN = 'PROPERTIESV10/SET_FILTER_DOMAIN';

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

export type FetchAllPropertiesAction = {
  type: typeof FETCH_ALL_PROPERTIES;
  mappingConfigurationId?: string;
  mappingConfigurationLanguage?: string;
  mappingDictionaryLanguage?: string;
};

export type FetchPropertiesSuccessAction = {
  type: typeof FETCH_PROPERTIES_SUCCESS;
  properties: Property[];
};

export type FetchPropertiesErrorAction = {
  type: typeof FETCH_PROPERTIES_ERROR;
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

// Export all types
export type PropertiesActions =
  | FetchAllPropertiesAction
  | FetchPropertiesSuccessAction
  | FetchPropertiesErrorAction
  | SetFilterSearch
  | SetFilterSort
  | SetFilterDomainAction;