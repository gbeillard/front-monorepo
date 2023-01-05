import { createSelector } from 'reselect';
import { SortDirection } from '@bim-co/componentui-foundation';
import { baseState } from './reducer';
import { sortObjectArray, searchSpaces } from './utils';
import { Space } from './types';

const selectRoot = (store): typeof baseState => store.spacesState;

export const selectSpaces = createSelector(selectRoot, (state): Space[] => state.spaces);

export const selectFilterSearch = createSelector(
  selectRoot,
  (state): string => state.filter.search
);

export const selectFetchSpacesIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchSpaces.success
);
export const selectFetchSpacesIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchSpaces.pending
);
export const selectFetchSpacesIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchSpaces.error
);

export const selectDeleteSpaceIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteSpace.success
);
export const selectDeleteSpaceIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteSpace.pending
);
export const selectDeleteSpaceIsError = createSelector(
  selectRoot,
  (state): string => state.api.deleteSpace.error
);

export const selectCreateSpaceIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.createSpace.success
);
export const selectCreateSpaceIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.createSpace.pending
);
export const selectCreateSpaceIsError = createSelector(
  selectRoot,
  (state): string => state.api.createSpace.error
);

export const selectUpdateSpaceIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.updateSpace.success
);
export const selectUpdateSpaceIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.updateSpace.pending
);
export const selectUpdateSpaceIsError = createSelector(
  selectRoot,
  (state): string => state.api.updateSpace.error
);

export const selectAskAuthorizationIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.askAuthorization.success
);
export const selectAskAuthorizationIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.askAuthorization.pending
);
export const selectAskAuthorizationIsError = createSelector(
  selectRoot,
  (state): string => state.api.askAuthorization.error
);

export const selectSortOrderBy = createSelector(selectRoot, (state) => state.sortOrderBy);
export const selectSortDirection = createSelector(selectRoot, (state) => state.sortDirection);

export const selectSearchedSpaces = createSelector(
  selectSpaces,
  selectFilterSearch,
  selectSortOrderBy,
  selectSortDirection,
  (space, search, orderBy, direction): Space[] =>
    searchAndSortSpaces(space, search, orderBy, direction)
);

const searchAndSortSpaces = (
  spaces: Space[],
  search: string,
  field: string,
  order: SortDirection
) => {
  let searchedSpaces = searchSpaces(spaces, search);

  searchedSpaces = sortObjectArray(searchedSpaces, field, order);

  return [...searchedSpaces];
};

export const selectSortedSpaces = createSelector(
  selectSpaces,
  selectSortOrderBy,
  selectSortDirection,
  (spaces, orderBy, direction) => sortObjectArray(spaces, orderBy, direction)
);