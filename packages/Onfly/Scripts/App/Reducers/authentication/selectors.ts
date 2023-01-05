import { createSelector } from 'reselect';
import { State } from './types';

const selectRoot = (store: any): State => store.authentication;

export const selectSigninState = createSelector(selectRoot, (state) => state.api.signin);

export const selectSigninIsPending = createSelector(
  selectSigninState,
  (signinState) => signinState.pending
);

export const selectSigninIsSuccessful = createSelector(
  selectSigninState,
  (signinState) => signinState.success
);

export const selectSigninIsError = createSelector(
  selectSigninState,
  (signinState) => signinState.error
);
