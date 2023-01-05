import { createSelector } from 'reselect';
import { baseState } from './reducer';
import { Property, FilterSort, Domain, PropertySubsetsError } from './types';
import { searchProperties, sortObjectArray, filterByDomain, extractDomains } from './utils';

const selectRoot = (store): typeof baseState => store.setPropertiesState;

export const selectProperties = createSelector(selectRoot, (state): Property[] => state.properties);
export const selectFetchPropertiesIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchProperties.success
);
export const selectFetchPropertiesIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchProperties.pending
);
export const selectFetchPropertiesIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchProperties.error
);

export const selectUpdatePropertySubsetsIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.updatePropertySubsets.success
);
export const selectUpdatePropertySubsetsIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.updatePropertySubsets.pending
);
export const selectUpdatePropertySubsetsIsError = createSelector(
  selectRoot,
  (state): PropertySubsetsError => state.api.updatePropertySubsets.error
);

export const selectDeletePropertiesIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteProperties.success
);
export const selectDeletePropertiesIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteProperties.pending
);
export const selectDeletePropertiesIsError = createSelector(
  selectRoot,
  (state): string => state.api.deleteProperties.error
);

export const selectAddPropertiesIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.addProperties.success
);
export const selectAddPropertiesIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.addProperties.pending
);
export const selectAddPropertiesIsError = createSelector(
  selectRoot,
  (state): string => state.api.addProperties.error
);

// Filter
export const selectFilterSearch = createSelector(
  selectRoot,
  (state): string => state.filter.search
);
export const selectFilterSort = createSelector(
  selectRoot,
  (state): FilterSort => state.filter.sort
);
export const selectSearchedProperties = createSelector(
  selectProperties,
  selectFilterSearch,
  (properties, search): Property[] => searchedProperties(properties, search)
);
export const selectFilteredProperties = createSelector(
  selectSearchedProperties,
  selectFilterSort,
  (properties, sort): Property[] => filteredProperties(properties, sort)
);

export const selectFilterByDomain = createSelector(
  selectRoot,
  (state): Domain => state.filter.domain
);

export const selectPropertiesFilteredByDomain = createSelector(
  selectSearchedProperties,
  selectFilterByDomain,
  (properties, filter): Property[] => filteredPropertiesByDomain(properties, filter)
);

export const selectPropertiesFilteredByDomainAndText = createSelector(
  selectPropertiesFilteredByDomain,
  selectFilterSearch,
  (properties, filter): Property[] => searchedProperties(properties, filter)
);

export const selectDomains = createSelector(selectProperties, (properties): Domain[] =>
  extractDomains(properties)
);

const searchedProperties = (properties: Property[], search: string): Property[] =>
  searchProperties(properties, search);

const filteredProperties = (properties: Property[], sort: FilterSort): Property[] =>
  sortObjectArray(properties, sort.field, sort.order);

const filteredPropertiesByDomain = (properties: Property[], domain: Domain): Property[] =>
  filterByDomain(properties, domain);