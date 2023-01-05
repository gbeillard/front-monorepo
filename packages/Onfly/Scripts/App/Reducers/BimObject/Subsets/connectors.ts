import { createStructuredSelector } from 'reselect';

import { Subset } from '../../Sets/Subsets/types';
import { Filter } from './types';

import {
  fetchSubsets as fetchSubsetsAction,
  setFilter as setFilterAction,
  addSubsets as addSubsetsAction,
  deleteSubset as deleteSubsetAction,
} from './actions';

import {
  selectSubsets,
  selectFilteredSubsets,
  selectSets,
  selectFilter,
  selectFetchSubsetsIsSuccess,
  selectFetchSubsetsIsPending,
  selectFetchSubsetsIsError,
  selectAddSubsetsIsSuccess,
  selectAddSubsetsIsError,
  selectDeleteSubsetIsSuccess,
  selectDeleteSubsetIsError,
} from './selectors';

/* Dispatchers */
const DispatcherActions = (dispatch) => ({
  fetchSubsets: (bimObjectId: number) => dispatch(fetchSubsetsAction(bimObjectId)),
  setFilter: (filter: Filter) => dispatch(setFilterAction(filter)),
  addSubsets: (bimObjectId: number, subsets: Subset[]) =>
    dispatch(addSubsetsAction(bimObjectId, subsets)),
  deleteSubset: (bimObjectId: number, subsetId: number, keepPropertiesWithValue: boolean) =>
    dispatch(deleteSubsetAction(bimObjectId, subsetId, keepPropertiesWithValue)),
});

export const BimObjectSubsetsDispatchers = (dispatch) => ({
  bimObjectSubsetsProps: DispatcherActions(dispatch),
});

/* Selectors */
const StructuredSelectors = createStructuredSelector({
  subsets: selectSubsets,
  filteredSubsets: selectFilteredSubsets,
  fetchSubsetsIsSuccess: selectFetchSubsetsIsSuccess,
  fetchSubsetsIsPending: selectFetchSubsetsIsPending,
  fetchSubsetsIsError: selectFetchSubsetsIsError,
  sets: selectSets,
  filter: selectFilter,
  addSubsetsIsSuccess: selectAddSubsetsIsSuccess,
  addSubsetsIsError: selectAddSubsetsIsError,
  deleteSubsetIsSuccess: selectDeleteSubsetIsSuccess,
  deleteSubsetIsError: selectDeleteSubsetIsError,
});

export const BimObjectSubsetsSelectors = {
  bimObjectSubsetsProps: StructuredSelectors,
};

/* Props */
export type BimObjectSubsetsProps = {
  bimObjectSubsetsProps: ReturnType<typeof DispatcherActions> &
  ReturnType<typeof StructuredSelectors>;
};

/* Merge props */
export const BimObjectSubsetsMergeProps = (stateProps, dispatchProps) => ({
  bimObjectSubsetsProps: {
    ...stateProps.bimObjectSubsetsProps,
    ...dispatchProps.bimObjectSubsetsProps,
  },
});