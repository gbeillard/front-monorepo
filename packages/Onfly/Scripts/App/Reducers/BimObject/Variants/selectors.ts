import { createSelector } from 'reselect';
import { baseState } from './reducer';

const selectRoot = (store): typeof baseState => store.variants;

export const selectVariants = createSelector(selectRoot, (state) => state.variants);