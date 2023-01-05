import { createStructuredSelector } from 'reselect';

import { fetchAuthorization as fetchAuthorizationAction } from './actions';

import {
  selectFetchAutorizationIsSuccess,
  selectFetchAutorizationIsError,
  selectFetchAutorizationIsPending,
  selectUserPermissionsByActionZone,
} from './selectors';

/* Dispatchers */
const BimObjectUserDispatcherActions = (dispatch) => ({
  fetchAuthorization: (bimObjectId: number) => dispatch(fetchAuthorizationAction(bimObjectId)),
});

export const BimObjectUserDispatchers = (dispatch) => ({
  bimObjectUserProps: BimObjectUserDispatcherActions(dispatch),
});

/* Selectors */
const BimObjectUserStructuredSelectors = createStructuredSelector({
  userPermissionsByActionZone: selectUserPermissionsByActionZone,
  fetchAutorizationIsSuccess: selectFetchAutorizationIsSuccess,
  fetchAutorizationIsPending: selectFetchAutorizationIsPending,
  fetchAutorizationIsError: selectFetchAutorizationIsError,
});

export const BimObjectUserSelectors = {
  bimObjectUserProps: BimObjectUserStructuredSelectors,
};

/* Props */
export type BimObjectUserProps = {
  bimObjectUserProps: ReturnType<typeof BimObjectUserDispatcherActions> &
  ReturnType<typeof BimObjectUserStructuredSelectors>;
};

/* Merge props */
export const BimObjectUserMergeProps = (stateProps, dispatchProps) => ({
  bimObjectUserProps: {
    ...stateProps.bimObjectUserProps,
    ...dispatchProps.bimObjectUserProps,
  },
});