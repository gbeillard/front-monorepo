import { createSelector } from 'reselect';
import _ from 'underscore';
import { baseState } from './reducer';

const selectRoot = (store): typeof baseState => store.bimObjectPropertiesSubsetsState;

/* Add subset to property */

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

/* Delete subset from property */

export const selectDeleteSubsetIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.removeSubsets.success
);
export const selectDeleteSubsetIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.removeSubsets.pending
);
export const selectDeleteSubsetIsError = createSelector(
  selectRoot,
  (state): string => state.api.removeSubsets.error
);