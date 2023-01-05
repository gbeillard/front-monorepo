import { createSelector } from 'reselect';
import { baseState } from './reducer';
import { Subset } from '../../Sets/Subsets/types';
import { getFilteredSubsets, getSets } from './utils';

const selectRoot = (store): typeof baseState => store.classificationsSubsets;

export const selectSubsets = createSelector(selectRoot, (state): Subset[] => state.subsets);
export const selectFilter = createSelector(selectRoot, (state) => state.filter);
export const selectFilteredSubsets = createSelector(
  selectSubsets,
  selectFilter,
  (subsets, filter) => getFilteredSubsets(subsets, filter)
);

export const selectSets = createSelector(selectSubsets, (subsets) => getSets(subsets));