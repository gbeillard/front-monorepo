import { createSelector } from 'reselect';
import { initialState } from '../create-property-reducer';

const selectRoot = (store): typeof initialState => store.createPropertyState;

export const selectSendPropertyRequestIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.sendPropertyRequest.success
);
export const selectSendPropertyRequestIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.sendPropertyRequest.pending
);
export const selectSendPropertyRequestIsError = createSelector(
  selectRoot,
  (state): string => state.api.sendPropertyRequest.error
);