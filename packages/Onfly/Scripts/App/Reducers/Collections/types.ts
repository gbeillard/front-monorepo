import {
  CollectionStatus,
  FETCH_COLLECTIONS,
  FETCH_COLLECTIONS_SUCCESS,
  FETCH_COLLECTIONS_ERROR,
  SET_FILTER_SEARCH,
  CREATE_COLLECTION,
  CREATE_COLLECTION_SUCCESS,
  CREATE_COLLECTION_ERROR,
  UPDATE_COLLECTION,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_ERROR,
  DELETE_COLLECTION,
  DELETE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_ERROR,
  FETCH_COLLECTION,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTION_ERROR,
  UPDATE_COLLECTION_BIMOBJECTS,
  UPDATE_COLLECTION_BIMOBJECTS_SUCCESS,
  UPDATE_COLLECTION_BIMOBJECTS_ERROR,
} from './constants';

/* Models */

export type CollectionWrite = {
  Id?: number;
  Name: string;
  Description?: string;
  Status: CollectionStatus;
  UpdatedAt?: Date;
  UpdatedBy?: CollectionUser;
};

export type Collection = CollectionWrite & {
  Id: number;
  UpdatedAt: Date;
  UpdatedBy: CollectionUser;
  IsFavorite: boolean;
  Statistics: CollectionStatistics;
};

export type CollectionUser = {
  Id: number;
  FirstName: string;
  LastName: string;
};

export type CollectionStatistics = {
  NbBimObjects: number;
};

export type CollectionBimObject = {
  Id: number;
  IsFavorite: boolean;
};

/* Actions */

export type FetchCollectionsAction = {
  type: typeof FETCH_COLLECTIONS;
};

export type FetchCollectionsSuccessAction = {
  type: typeof FETCH_COLLECTIONS_SUCCESS;
  collections: Collection[];
};

export type FetchCollectionsErrorAction = {
  type: typeof FETCH_COLLECTIONS_ERROR;
  error: string;
};

export type SetCollectionsSearchAction = {
  type: typeof SET_FILTER_SEARCH;
  search: string;
};

export type FetchCollectionAction = {
  type: typeof FETCH_COLLECTION;
  collectionId: number;
};

export type CreateCollectionAction = {
  type: typeof CREATE_COLLECTION;
  collection: CollectionWrite;
};
export type DeleteCollectionAction = {
  type: typeof DELETE_COLLECTION;
  collectionId: number;
};

export type CreateCollectionSuccessAction = {
  type: typeof CREATE_COLLECTION_SUCCESS;
};

export type CreateCollectionErrorAction = {
  type: typeof CREATE_COLLECTION_ERROR;
  error: string;
};

export type UpdateCollectionAction = {
  type: typeof UPDATE_COLLECTION;
  collection: CollectionWrite;
};

export type UpdateCollectionSuccessAction = {
  type: typeof UPDATE_COLLECTION_SUCCESS;
};

export type UpdateCollectionErrorAction = {
  type: typeof UPDATE_COLLECTION_ERROR;
  error: string;
};

export type DeleteCollectionSuccessAction = {
  type: typeof DELETE_COLLECTION_SUCCESS;
};

export type DeleteCollectionErrorAction = {
  type: typeof DELETE_COLLECTION_ERROR;
  error: string;
};

export type FetchCollectionSuccessAction = {
  type: typeof FETCH_COLLECTION_SUCCESS;
  collection: Collection;
};

export type FetchCollectionErrorAction = {
  type: typeof FETCH_COLLECTION_ERROR;
  error: string;
};

export type UpdateCollectionBimObjectsAction = {
  type: typeof UPDATE_COLLECTION_BIMOBJECTS;
  bimObjects: CollectionBimObject[];
};

export type UpdateCollectionBimObjectsSuccessAction = {
  type: typeof UPDATE_COLLECTION_BIMOBJECTS_SUCCESS;
};

export type UpdateCollectionBimObjectsErrorAction = {
  type: typeof UPDATE_COLLECTION_BIMOBJECTS_ERROR;
  error: string;
};

export type CollectionsActions =
  | FetchCollectionsAction
  | FetchCollectionsSuccessAction
  | FetchCollectionsErrorAction
  | SetCollectionsSearchAction
  | CreateCollectionAction
  | CreateCollectionSuccessAction
  | CreateCollectionErrorAction
  | UpdateCollectionAction
  | UpdateCollectionSuccessAction
  | UpdateCollectionErrorAction
  | DeleteCollectionAction
  | DeleteCollectionSuccessAction
  | DeleteCollectionErrorAction
  | FetchCollectionAction
  | FetchCollectionSuccessAction
  | FetchCollectionErrorAction
  | UpdateCollectionBimObjectsAction
  | UpdateCollectionBimObjectsSuccessAction
  | UpdateCollectionBimObjectsErrorAction;