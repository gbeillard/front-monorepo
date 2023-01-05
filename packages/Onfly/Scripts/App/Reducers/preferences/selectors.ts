import { createSelector } from 'reselect';

const selectRoot = (store) => store.preferences;

export const selectPreferences = createSelector(selectRoot, (state) => state.preferences);