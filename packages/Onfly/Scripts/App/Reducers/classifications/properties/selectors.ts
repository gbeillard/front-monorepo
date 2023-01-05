import { createSelector } from 'reselect';
import { Set } from '../../properties-sets/types';
import { removeDiacritics } from '../../../Utils/utils';
import { Filter, NodeProperty, PropertyDomain } from './types';
import { searchProperties } from './utils';

const selectProperties = (store) => store.classificationsProperties;
export const selectNodeProperties = createSelector(selectProperties, (state) => state.properties);
export const selectFilter = createSelector(selectProperties, (state) => state.filter);
export const selectFilteredProperties = createSelector(
  selectNodeProperties,
  selectFilter,
  (properties: NodeProperty[], filter: Filter) => getFilteredProperties(properties, filter)
);

export const selectNodePropertiesIds = createSelector(
  selectProperties,
  (state) => state.nodePropertiesIds
);
export const selectFetchPayload = createSelector(
  selectProperties,
  (state) => state.api.fetch.payload
);
export const selectSelectedDomain = createSelector(
  selectProperties,
  (state) => state.selectedDomain
);

export const selectDomains = createSelector(selectNodeProperties, (properties: NodeProperty[]) =>
  getDomains(properties)
);
export const selectSets = createSelector(selectNodeProperties, (properties: NodeProperty[]) =>
  getSets(properties)
);

export const selectCurrentProperty = createSelector(
  selectProperties,
  (state) => state.currentProperty
);

export const selectIsFetchingProperties = createSelector(
  selectProperties,
  (state) => state.api.fetch.pending
);

const getDomains = (properties: NodeProperty[]): PropertyDomain[] => {
  const domains = properties.reduce(
    (domains: PropertyDomain[], property) =>
      domains.find((domain) => domain.Id === property.Domain.Id)
        ? domains
        : [...domains, property.Domain],
    []
  );

  return [...domains].sort((a, b) => a?.Name.localeCompare(b?.Name));
};

const getSets = (properties: NodeProperty[]): Set[] =>
  properties
    .reduce(
      (sets: Set[], property) => [...sets, ...property.Subsets.map((subset) => subset.Set)],
      []
    ) // flatten
    .reduce(
      (sets: Set[], set) => (sets.find((unique) => unique.Id === set.Id) ? sets : [...sets, set]),
      []
    ); // dedupe

const normalize = (word: string) => removeDiacritics(word.toLowerCase());

/**
 * Search a text into the given list
 * @deprecated
 * @param properties the list to search into
 * @param text the text to look for
 */
const getTextFilteredProperties = (properties: NodeProperty[], text: string): NodeProperty[] => {
  if (text.length < 3) {
    return properties;
  }

  const terms = text.trim().split(' ');

  return properties.filter((property) =>
    terms.every((term) => normalize(property.Name).includes(normalize(term)))
  );
};

const getDomainFilteredProperties = (
  properties: NodeProperty[],
  domainId: number
): NodeProperty[] => {
  if (domainId === null) {
    return properties;
  }

  return properties.filter((property) => property.Domain?.Id === domainId);
};

const getSetFilteredProperties = (properties: NodeProperty[], setId: number): NodeProperty[] => {
  if (setId === null) {
    return properties;
  }

  return properties.filter((property) =>
    property.Subsets.find((subset) => subset.Set.Id === setId)
  );
};

const getFilteredProperties = (properties: NodeProperty[], filter: Filter): NodeProperty[] => {
  const { text, domainId, setId } = filter;
  const textFilteredProperties = searchProperties(properties, text);
  const domainFilteredProperties = getDomainFilteredProperties(textFilteredProperties, domainId);
  return getSetFilteredProperties(domainFilteredProperties, setId);
};