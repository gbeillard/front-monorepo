import { createSelector } from 'reselect';
import { baseState } from './reducer';
import { Subset, SubsetForDisplay } from './types';

import { Set } from '../../properties-sets/types';

import { sortObjectArray } from '../Properties/utils';
import { filterBySet, extractSets, getSubsetsFilteredByText } from './utils';

const selectRoot = (store): typeof baseState => store.setSubsetsState;

export const selectFilterText = createSelector(selectRoot, (state): string => state.filter.text);
export const selectFilterSet = createSelector(selectRoot, (state): Set => state.filter.propertySet);

export const selectFetchSubsetsIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchSubsets.success
);
export const selectFetchSubsetsIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchSubsets.pending
);
export const selectFetchSubsetsIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchSubsets.error
);

export const selectFetchAllSubsetsIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchAllSubsets.success
);
export const selectFetchAllSubsetsIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchAllSubsets.pending
);
export const selectFetchAllSubsetsIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchAllSubsets.error
);

export const selectCreateSubsetIsSuccess = createSelector(
  selectRoot,
  (state): object => state.api.createSubset.success
);
export const selectCreateSubsetIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.createSubset.pending
);
export const selectCreateSubsetIsError = createSelector(
  selectRoot,
  (state): string => state.api.createSubset.error
);

export const selectSubsets = createSelector(selectRoot, (state): Subset[] => state.subsets);

export const selectSubsetsWithoutDefault = createSelector(selectSubsets, (subsets): Subset[] =>
  subsets?.filter((subset) => !subset.IsDefault)
);
export const selectSubsetsWithoutDefaultSorted = createSelector(
  selectSubsetsWithoutDefault,
  (subsets): Subset[] => sortObjectArray(subsets, 'Name')
);
export const selectSubsetsWithoutDefaultFilteredBySet = createSelector(
  selectSubsetsWithoutDefaultSorted,
  selectFilterSet,
  (subsets, set): Subset[] => filteredBySet(subsets, set)
);
export const selectSubsetsWithoutDefaultFilteredBySetAndText = createSelector(
  selectSubsetsWithoutDefaultFilteredBySet,
  selectFilterText,
  (subsets, filter): Subset[] => filteredByText(subsets, filter)
);

// Extracting Sets from Subsets
export const selectSets = createSelector(selectSubsets, (subsets): Set[] => extractSets(subsets));

/**
 * Popin section
 */
export const selectAllSubsets = createSelector(selectRoot, (state): Subset[] => state.allSubsets);

export const selectAllSubsetsForDisplay = createSelector(
  selectAllSubsets,
  (subsets): SubsetForDisplay[] =>
    subsets.map((subset) => ({
      ...subset,
      // eslint-disable-next-line no-nested-ternary
      displayName: subset.IsDefault
        ? `${subset.Set?.Name}`
        : subset?.Set
          ? `${subset?.Set?.Name} - ${subset?.Name}`
          : `${subset?.Name}`,
      description: subset?.Set?.Description,
    }))
);

export const selectAllSubsetsForDisplaySorted = createSelector(
  selectAllSubsetsForDisplay,
  (subsets): SubsetForDisplay[] => sortObjectArray(subsets, 'displayName')
);
export const selectAllSubsetsForDisplaySortedWithoutDefault = createSelector(
  selectAllSubsetsForDisplaySorted,
  (subsets): SubsetForDisplay[] => subsets?.filter((subset) => !subset.IsDefault)
);
export const selectAllSubsetsForDisplayWithDefaultFilteredBySet = createSelector(
  selectAllSubsetsForDisplaySorted,
  selectFilterSet,
  (subsets, set): SubsetForDisplay[] => filteredBySet(subsets, set)
);
export const selectAllSubsetsForDisplayFilteredBySet = createSelector(
  selectAllSubsetsForDisplaySortedWithoutDefault,
  selectFilterSet,
  (subsets, set): SubsetForDisplay[] => filteredBySet(subsets, set)
);

export const selectAllSubsetsForDisplayWithDefaultFilteredBySetAndText = createSelector(
  selectAllSubsetsForDisplayWithDefaultFilteredBySet,
  selectFilterText,
  (subsets, filter): SubsetForDisplay[] => filteredByFieldsText(subsets, filter)
);
export const selectAllSubsetsForDisplayFilteredBySetAndText = createSelector(
  selectAllSubsetsForDisplayFilteredBySet,
  selectFilterText,
  (subsets, filter): SubsetForDisplay[] => filteredByText(subsets, filter)
);

// Extracting Sets from Subsets
export const selectAllSets = createSelector(selectAllSubsets, (subsets): Set[] =>
  extractSets(subsets)
);

/**
 * API status selectors
 */
export const selectAddSubsetPropertiesIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.addSubsetProperties.success
);
export const selectAddSubsetPropertiesIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.addSubsetProperties.pending
);
export const selectAddSubsetPropertiesIsError = createSelector(
  selectRoot,
  (state): string => state.api.addSubsetProperties.error
);
export const selectDeleteSubsetPropertiesIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteSubsetProperties.success
);
export const selectDeleteSubsetPropertiesIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteSubsetProperties.pending
);
export const selectDeleteSubsetPropertiesIsError = createSelector(
  selectRoot,
  (state): string => state.api.deleteSubsetProperties.error
);

/**
 * Utility functions interface
 */
const filteredBySet = (subsets: any[], set: Set): any[] => filterBySet(subsets, set);
const filteredByText = (subsets: any[], filter: string): any[] =>
  getSubsetsFilteredByText(subsets, filter);
const filteredByFieldsText = (subsets: any[], filter: string): any[] =>
  sortObjectArray(
    getSubsetsFilteredByText(subsets, filter, ['displayName', 'description']),
    'displayName'
  );