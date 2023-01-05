import { createStructuredSelector } from 'reselect';

import { Subset } from '../../../Sets/Subsets/types';
import { Property } from '../types';

import {
  addSubset as addSubsetToPropertyAction,
  removeSubset as removeSubsetFromPropertyAction,
} from './actions';

import { selectAddSubsetsIsError, selectDeleteSubsetIsError } from './selectors';

/* Dispatchers */
const DispatcherActions = (dispatch) => ({
  addSubsetToProperty: (bimObjetctId: number, property: Property, subset: Subset) =>
    dispatch(addSubsetToPropertyAction(bimObjetctId, property, subset)),
  removeSubsetFromProperty: (bimObjetctId: number, property: Property, subset: Subset) =>
    dispatch(removeSubsetFromPropertyAction(bimObjetctId, property, subset)),
});

export const BimObjectPropertiesSubsetsDispatchers = (dispatch) => ({
  bimObjectPropertiesSubsetsProps: DispatcherActions(dispatch),
});

/* Selectors */
const StructuredSelectors = createStructuredSelector({
  addSubsetsIsError: selectAddSubsetsIsError,
  deleteSubsetIsError: selectDeleteSubsetIsError,
});

export const BimObjectPropertiesSubsetsSelectors = {
  bimObjectPropertiesSubsetsProps: StructuredSelectors,
};

/* Props */
export type BimObjectPropertiesSubsetsProps = {
  bimObjectPropertiesSubsetsProps: ReturnType<typeof DispatcherActions> &
  ReturnType<typeof StructuredSelectors>;
};

/* Merge props */
export const BimObjectPropertiesSubsetsMergeProps = (stateProps, dispatchProps) => ({
  bimObjectPropertiesSubsetsProps: {
    ...stateProps.bimObjectPropertiesSubsetsProps,
    ...dispatchProps.bimObjectPropertiesSubsetsProps,
  },
});