import { createStructuredSelector } from 'reselect';

import { fetchBimObject as fetchBimObjectAction } from './actions';

import {
  selectFetchBimObjectIsSuccess,
  selectFetchBimObjectIsPending,
  selectFetchBimObjectIsError,
  selectBimObject,
} from './selectors';

/* Dispatchers */
const BimObjectDispatcherActions = (dispatch) => ({
  fetchBimObject: (bimObjectId: number) => dispatch(fetchBimObjectAction(bimObjectId)),
});

export const BimObjectDispatchers = (dispatch) => ({
  bimObjectProps: BimObjectDispatcherActions(dispatch),
});

/* Selectors */
const BimObjectStructuredSelectors = createStructuredSelector({
  bimObject: selectBimObject,
  fetchBimObjectIsSuccess: selectFetchBimObjectIsSuccess,
  fetchBimObjectIsPending: selectFetchBimObjectIsPending,
  fetchBimObjectIsError: selectFetchBimObjectIsError,
});

export const BimObjectSelectors = {
  bimObjectProps: BimObjectStructuredSelectors,
};

/* Props */
export type BimObjectProps = {
  bimObjectProps: ReturnType<typeof BimObjectDispatcherActions> &
  ReturnType<typeof BimObjectStructuredSelectors>;
};

/* Merge props */
export const BimObjectMergeProps = (stateProps, dispatchProps) => ({
  bimObjectProps: {
    ...stateProps.bimObjectProps,
    ...dispatchProps.bimObjectProps,
  },
});