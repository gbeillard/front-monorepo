import { createSelector } from 'reselect';
import _ from 'underscore';
import { baseState } from './reducer';
import { getFilteredSubsets, getSets } from './utils';

import { Subset } from '../../Sets/Subsets/types';

const selectRoot = (store): typeof baseState => store.bimObjectSubsetsState;

/* Delete subset */

export const selectDeleteSubsetIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteSubset.success
);
export const selectDeleteSubsetIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteSubset.pending
);
export const selectDeleteSubsetIsError = createSelector(
  selectRoot,
  (state): string => state.api.deleteSubset.error
);

/* Add subsets */

export const selectAddSubsetsIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.addSubsets.success
);
export const selectAddSubsetsIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.addSubsets.pending
);
export const selectAddSubsetsIsError = createSelector(
  selectRoot,
  (state): string => state.api.addSubsets.error
);

/* Filter */
export const selectFilter = createSelector(selectRoot, (state) => state.filter);

/* subsets */

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

export const selectSubsets = createSelector(selectRoot, (state): Subset[] => state.subsets);
export const selectFilteredSubsets = createSelector(
  selectSubsets,
  selectFilter,
  (subsets, filter) => {
    const filteredSubsets = getFilteredSubsets(subsets, filter);
    return _.chain(filteredSubsets)
      .sortBy((subset) => subset?.Name?.toLowerCase())
      .sortBy((subset) => subset?.Set?.Name?.toLowerCase())
      .value();
  }
);

export const selectSets = createSelector(selectSubsets, (subsets) => {
  const sets = getSets(subsets);
  return _.sortBy(sets, (set) => set?.Name?.toLowerCase());
});