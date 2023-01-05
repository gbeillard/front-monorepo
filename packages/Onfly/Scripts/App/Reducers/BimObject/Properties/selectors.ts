import { createSelector } from 'reselect';
import _ from 'underscore';
import { baseState } from './reducer';
import { removeDiacritics } from '../../../Utils/utils';
import { Property, Domain, Filter } from './types';
import { getSets } from '../Subsets/utils';

import { Subset } from '../../Sets/Subsets/types';

const selectRoot = (store): typeof baseState => store.bimObjectPropertiesState;

/* Delete property */

export const selectDeletePropertyIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteProperty.success
);
export const selectDeletePropertyIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteProperty.pending
);
export const selectDeletePropertyIsError = createSelector(
  selectRoot,
  (state): string => state.api.deleteProperty.error
);

/* Add properties */

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

/* Filter */
export const selectFilter = createSelector(selectRoot, (state) => state.filter);

/* Properties */

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

export const selectProperties = createSelector(selectRoot, (state): Property[] => state.properties);
export const selectFilteredProperties = createSelector(
  selectProperties,
  selectFilter,
  (properties, filter) => {
    const filteredProperties = getFilteredProperties(properties, filter);
    return _.sortBy(filteredProperties, (property) => property?.Name?.toLowerCase());
  }
);

// All subsets of the properties
export const selectPropertiesSubsets = createSelector(selectProperties, (properties): Subset[] =>
  getSubsets(properties)
);

// All sets of the properties
export const selectSets = createSelector(selectPropertiesSubsets, (subsets) => {
  const sets = getSets(subsets);
  return _.sortBy(sets, (set) => set?.Name?.toLowerCase());
});

export const selectPropertiesDomains = createSelector(selectProperties, (properties): Domain[] => {
  const domains = getDomains(properties);
  return _.sortBy(domains, (domain) => domain?.Name?.toLowerCase());
});

const getDomains = (properties: Property[]): Domain[] =>
  properties.reduce(
    (domains: Domain[], property) =>
      domains.find((domain) => domain.Id === property.Domain.Id)
        ? domains
        : [...domains, property.Domain],
    []
  );

const getSubsets = (properties: Property[]): Subset[] =>
  properties?.reduce((subsets: Subset[], property) => {
    const newSubsets = [] as Subset[];

    property?.Subsets?.forEach((propertySubset) => {
      const subsetFound = subsets?.find((subset) => subset?.Id === propertySubset?.Id);
      if (subsetFound == null) {
        newSubsets?.push(propertySubset);
      }
    });

    return [...subsets, ...newSubsets];
  }, []);

const normalize = (word: string) => removeDiacritics(word.toLowerCase());

const getTextFilteredProperties = (properties: Property[], text: string): Property[] => {
  if (text.length < 3) {
    return properties;
  }

  const terms = text.trim().split(' ');

  return properties.filter((property) =>
    terms.every((term) => normalize(property.Name).includes(normalize(term)))
  );
};

const getDomainFilteredProperties = (properties: Property[], domainId: number): Property[] => {
  if (domainId === null) {
    return properties;
  }

  return properties.filter((property) => property.Domain?.Id === domainId);
};

const getSetFilteredProperties = (properties: Property[], setId: number): Property[] => {
  if (setId === null) {
    return properties;
  }

  return properties.filter((property) =>
    property.Subsets.find((subset) => subset.Set.Id === setId)
  );
};

const getFilteredProperties = (properties: Property[], filter: Filter): Property[] => {
  const { text, domainId, setId } = filter;
  const textFilteredProperties = getTextFilteredProperties(properties, text);
  const domainFilteredProperties = getDomainFilteredProperties(textFilteredProperties, domainId);
  return getSetFilteredProperties(domainFilteredProperties, setId);
};