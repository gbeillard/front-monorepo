/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createSelector } from 'reselect';
import FlexSearch from 'flexsearch';
import { sortObjectArray } from '../Sets/Properties/utils'; // TODO : replace the same function in the DS (@bim-co/componentui-foundation/components/utils) by this one

const selectPropertiesSet = (store) => store.propertiesSets;

export const selectSet = createSelector(selectPropertiesSet, (state) => state.propertiesSet);
export const selectFetchSetIsSuccess = createSelector(
  selectPropertiesSet,
  (state) => state.apiState.fetchSet.success
);
export const selectFetchSetIsPending = createSelector(
  selectPropertiesSet,
  (state) => state.apiState.fetchSet.pending
);
export const selectFetchSetIsError = createSelector(
  selectPropertiesSet,
  (state) => state.apiState.fetchSet.error
);

export const selectPropertiesSets = createSelector(
  selectPropertiesSet,
  (state) => state.propertiesSets
);
export const sortOrderBy = createSelector(selectPropertiesSet, (state) => state.sortOrderBy);
export const sortDirection = createSelector(selectPropertiesSet, (state) => state.sortDirection);
export const selectFilter = createSelector(selectPropertiesSet, (state) => state.filter);
export const selectApiState = createSelector(selectPropertiesSet, (state) => state.apiState);
export const selectNormalizedFilter = createSelector(selectFilter, (filter) =>
  normalizeFilter(filter)
);

export const selectFilteredProprtiesSets = createSelector(
  selectNormalizedFilter,
  selectPropertiesSets,
  (filter, propertiesSets) => filterPropertiesSets(filter, propertiesSets)
);

export const selectSortedPropertySets = createSelector(
  selectFilteredProprtiesSets,
  sortOrderBy,
  sortDirection,
  (propertiesSets, orderBy, direction) =>
    sortObjectArray(propertiesSets.asMutable(), orderBy, direction)
);

const filterPropertiesSets = (filter, propertiesSets) =>
  propertiesSets.reduce(() => {
    const filteredPropertiesSets = getFilteredPropertiesSet(filter, propertiesSets);
    if (filter.text.length === 0) {
      return propertiesSets;
    }
    return filteredPropertiesSets;
  }, []);

const normalizeFilter = (filter) => ({
  ...filter,
  text: filter?.text && normalizeFilterText(filter),
});
const normalizeFilterText = ({ text }) =>
  text
    .toLowerCase()
    .replace(/-/, ' ')
    .replace(/_/, ' ')
    .split(/\s/)
    .filter((word) => word.length > 2);

const getHasText = (filter) => filter.text.length > 0 && filter.text[0].length > 0;
const matchText = ({ text }, { Name, Description }) =>
  text.filter(
    (word) => Name?.toLowerCase().includes(word) || Description?.toLowerCase().includes(word)
  ).length > 0;

const searchFlex = (filter, property) => {
  const hasText = getHasText(filter);
  if (!hasText) {
    return true;
  }

  return matchText(filter, property);
};

const getFilteredPropertiesSet = (filter, propertiesSet) => {
  const index = new FlexSearch({
    encode: 'advanced',
    tokenize: 'reverse',
    doc: {
      id: 'Id',
      field: 'Name',
    },
  });
  index.add(propertiesSet);

  const filteredPropertiesSet = index.where((propSet) => searchFlex(filter, propSet));
  if (filteredPropertiesSet.length < 1) {
    return [];
  }

  return filteredPropertiesSet;
};
