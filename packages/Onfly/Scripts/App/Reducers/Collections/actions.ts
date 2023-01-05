import {
  FETCH_COLLECTIONS,
  FETCH_COLLECTIONS_SUCCESS,
  FETCH_COLLECTIONS_ERROR,
  CREATE_COLLECTION,
  CREATE_COLLECTION_SUCCESS,
  CREATE_COLLECTION_ERROR,
  UPDATE_COLLECTION,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_ERROR,
  DELETE_COLLECTION,
  DELETE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_ERROR,
  SET_FILTER_SEARCH,
  FETCH_COLLECTION,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTION_ERROR,
  UPDATE_COLLECTION_BIMOBJECTS,
  UPDATE_COLLECTION_BIMOBJECTS_SUCCESS,
  UPDATE_COLLECTION_BIMOBJECTS_ERROR,
} from './constants';

import {
  Collection,
  FetchCollectionsAction,
  FetchCollectionsSuccessAction,
  FetchCollectionsErrorAction,
  CreateCollectionAction,
  CollectionWrite,
  CreateCollectionSuccessAction,
  CreateCollectionErrorAction,
  UpdateCollectionAction,
  UpdateCollectionSuccessAction,
  UpdateCollectionErrorAction,
  DeleteCollectionAction,
  DeleteCollectionSuccessAction,
  DeleteCollectionErrorAction,
  SetCollectionsSearchAction,
  FetchCollectionSuccessAction,
  FetchCollectionErrorAction,
  FetchCollectionAction,
  CollectionBimObject,
  UpdateCollectionBimObjectsAction,
  UpdateCollectionBimObjectsSuccessAction,
  UpdateCollectionBimObjectsErrorAction,
} from './types';

export const fetchCollections = (): FetchCollectionsAction => ({
  type: FETCH_COLLECTIONS,
});

export const fetchCollectionsSuccess = (
  collections: Collection[]
): FetchCollectionsSuccessAction => ({
  type: FETCH_COLLECTIONS_SUCCESS,
  collections,
});

export const fetchCollectionsError = (error: string): FetchCollectionsErrorAction => ({
  type: FETCH_COLLECTIONS_ERROR,
  error,
});

export const setCollectionsSearch = (search: string): SetCollectionsSearchAction => ({
  type: SET_FILTER_SEARCH,
  search,
});

export const createCollection = (collection: CollectionWrite): CreateCollectionAction => ({
  type: CREATE_COLLECTION,
  collection,
});

export const createCollectionSuccess = (): CreateCollectionSuccessAction => ({
  type: CREATE_COLLECTION_SUCCESS,
});

export const createCollectionError = (error: string): CreateCollectionErrorAction => ({
  type: CREATE_COLLECTION_ERROR,
  error,
});

export const updateCollection = (collection: CollectionWrite): UpdateCollectionAction => ({
  type: UPDATE_COLLECTION,
  collection,
});

export const updateCollectionSuccess = (): UpdateCollectionSuccessAction => ({
  type: UPDATE_COLLECTION_SUCCESS,
});

export const updateCollectionError = (error: string): UpdateCollectionErrorAction => ({
  type: UPDATE_COLLECTION_ERROR,
  error,
});

export const deleteCollection = (collectionId: number): DeleteCollectionAction => ({
  type: DELETE_COLLECTION,
  collectionId,
});

export const deleteCollectionSuccess = (): DeleteCollectionSuccessAction => ({
  type: DELETE_COLLECTION_SUCCESS,
});

export const deleteCollectionError = (error: string): DeleteCollectionErrorAction => ({
  type: DELETE_COLLECTION_ERROR,
  error,
});

export const fetchCollection = (collectionId): FetchCollectionAction => ({
  type: FETCH_COLLECTION,
  collectionId,
});

export const fetchCollectionSuccess = (collection: Collection): FetchCollectionSuccessAction => ({
  type: FETCH_COLLECTION_SUCCESS,
  collection,
});

export const fetchCollectionError = (error: string): FetchCollectionErrorAction => ({
  type: FETCH_COLLECTION_ERROR,
  error,
});

export const updateCollectionBimObjects = (
  bimObjects: CollectionBimObject[]
): UpdateCollectionBimObjectsAction => ({
  type: UPDATE_COLLECTION_BIMOBJECTS,
  bimObjects,
});

export const updateCollectionBimObjectsSuccess = (): UpdateCollectionBimObjectsSuccessAction => ({
  type: UPDATE_COLLECTION_BIMOBJECTS_SUCCESS,
});

export const updateCollectionBimObjectsError = (
  error: string
): UpdateCollectionBimObjectsErrorAction => ({
  type: UPDATE_COLLECTION_BIMOBJECTS_ERROR,
  error,
});