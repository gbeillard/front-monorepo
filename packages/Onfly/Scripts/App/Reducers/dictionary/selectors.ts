import { createSelector } from 'reselect';
import { getFilteredProperties, getVisibleProperties } from './utils';
import { baseState } from './reducer';

const selectRoot = (store): typeof baseState => store.dictionary;

export const selectProperties = createSelector(selectRoot, (state) => state.properties);
export const selectFilter = createSelector(selectRoot, (state) => state.filter);
export const selectSortBy = createSelector(selectRoot, (state) => state.sortBy);
export const selectSortOrder = createSelector(selectRoot, (state) => state.sortOrder);
export const selectVisibleCount = createSelector(selectRoot, (state) => state.visibleCount);

export const selectFilteredProperties = createSelector(
  selectProperties,
  selectFilter,
  selectSortBy,
  selectSortOrder,
  (properties, filter, sortBy, sortOrder) =>
    getFilteredProperties(properties, filter, sortBy, sortOrder)
);

export const selectVisibleProperties = createSelector(
  selectFilteredProperties,
  selectVisibleCount,
  (properties, visibleCount) => getVisibleProperties(properties, visibleCount)
);

export const selectAddOfficialPropertiesSuccess = createSelector(
  selectRoot,
  (state) => state.api.addOfficialProperties.success
);
export const selectDuplicatePropertySuccess = createSelector(
  selectRoot,
  (state) => state.api.duplicateProperty.success
);