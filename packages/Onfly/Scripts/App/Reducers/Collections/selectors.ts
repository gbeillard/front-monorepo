import { createSelector } from 'reselect';
import { baseState } from './reducer';
import { Collection } from './types';
import { searchCollections } from './utils';
import { sortObjectArray } from '../Sets/Properties/utils';

const selectRoot = (store): typeof baseState => store.collectionsState;

export const selectCollections = createSelector(
  selectRoot,
  (state): Collection[] => state.collections
);
export const selectFilterSearch = createSelector(
  selectRoot,
  (state): string => state.filter.search
);

export const selectCollection = createSelector(selectRoot, (state): Collection => state.collection);
export const selectFetchCollectionIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchCollection.success
);
export const selectFetchCollectionIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchCollection.pending
);
export const selectFetchCollectionIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchCollection.error
);

export const selectSearchedCollections = createSelector(
  selectCollections,
  selectFilterSearch,
  (collections, search): Collection[] => searchAndSortCollections(collections, search)
);

export const selectFetchCollectionsIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchCollections.success
);
export const selectFetchCollectionsIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchCollections.pending
);
export const selectFetchCollectionsIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchCollections.error
);

export const selectCreateCollectionIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.createCollection.success
);
export const selectCreateCollectionIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.createCollection.pending
);
export const selectCreateCollectionIsError = createSelector(
  selectRoot,
  (state): string => state.api.createCollection.error
);

export const selectUpdateCollectionIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.updateCollection.success
);
export const selectUpdateCollectionIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.updateCollection.pending
);
export const selectUpdateCollectionIsError = createSelector(
  selectRoot,
  (state): string => state.api.updateCollection.error
);

export const selectDeleteCollectionIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteCollection.success
);
export const selectDeleteCollectionIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.deleteCollection.pending
);
export const selectDeleteCollectionIsError = createSelector(
  selectRoot,
  (state): string => state.api.deleteCollection.error
);

export const selectUpdateCollectionBimObjectsIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.updateCollectionBimObjects.success
);
export const selectUpdateCollectionBimObjectsIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.updateCollectionBimObjects.pending
);
export const selectUpdateCollectionBimObjectsIsError = createSelector(
  selectRoot,
  (state): string => state.api.updateCollectionBimObjects.error
);

const searchAndSortCollections = (collections: Collection[], search: string) => {
  let searchedCollections = searchCollections(collections, search);

  searchedCollections = sortObjectArray(searchedCollections, 'Name', 'asc');

  return [...searchedCollections]?.sort((a, b) =>
    a?.IsFavorite === b?.IsFavorite ? 0 : a?.IsFavorite ? -1 : 1
  );
};