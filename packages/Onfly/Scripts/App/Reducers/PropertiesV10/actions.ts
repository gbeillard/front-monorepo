import { SortDirection } from '@bim-co/componentui-foundation';
import {
  Property,
  FETCH_ALL_PROPERTIES,
  FetchAllPropertiesAction,
  FETCH_PROPERTIES_SUCCESS,
  FetchPropertiesSuccessAction,
  FETCH_PROPERTIES_ERROR,
  FetchPropertiesErrorAction,
  SET_FILTER_SEARCH,
  SetFilterSearch,
  SET_FILTER_SORT,
  SetFilterSort,
  SET_FILTER_DOMAIN,
  SetFilterDomainAction,
  Domain,
} from './types';

/* API */

export const fetchAllProperties = (
  mappingConfigurationId?: string,
  mappingConfigurationLanguage?: string,
  mappingDictionaryLanguage?: string,
): FetchAllPropertiesAction => ({
  type: FETCH_ALL_PROPERTIES,
  mappingConfigurationId,
  mappingConfigurationLanguage,
  mappingDictionaryLanguage,
});

export const fetchPropertiesSuccess = (properties: Property[]): FetchPropertiesSuccessAction => ({
  type: FETCH_PROPERTIES_SUCCESS,
  properties,
});

export const fetchPropertiesError = (error: string): FetchPropertiesErrorAction => ({
  type: FETCH_PROPERTIES_ERROR,
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