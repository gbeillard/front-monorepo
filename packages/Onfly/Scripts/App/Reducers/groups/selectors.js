import { createSelector } from 'reselect';

const selectDomain = (store) => store.groups;
const selectPreferences = (store) => store.preferences;
export const selectGroups = createSelector(selectDomain, (state) => state.groups);
export const selectFilter = createSelector(selectDomain, (state) => state.filter);
export const selectOnflyUpload = createSelector(selectDomain, (state) => state.onflyUpload);
export const selectPlatformUpload = createSelector(selectDomain, (state) => state.platformUpload);
export const selectIsUploadMapping = createSelector(
  selectPreferences,
  (state) => state.preferences.UploadMapping
);

export const selectFilteredGroups = createSelector(selectGroups, selectFilter, (groups, filter) =>
  filterGroups(groups, filter)
);
export const selectSelectedGroups = createSelector(selectGroups, (groups) =>
  groups.filter((group) => group.selected)
);

const filterGroups = (groups, filter) => {
  if (filter.length < 3) {
    return groups;
  }

  return groups.filter((group) => group.Name.toLowerCase().includes(filter.toLowerCase()));
};
