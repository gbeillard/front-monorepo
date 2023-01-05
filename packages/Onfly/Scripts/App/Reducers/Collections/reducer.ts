import Immutable from 'seamless-immutable';

import {
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
import { Collection, CollectionsActions } from './types';
import { deleteCollection, updateCollection } from './utils';

export const baseState = {
  collections: [] as Collection[],
  collection: null as Collection,
  filter: {
    search: '',
  },
  api: {
    fetchCollections: {
      pending: false,
      success: false,
      error: undefined,
    },
    createCollection: {
      pending: false,
      success: false,
      error: undefined,
    },
    updateCollection: {
      pending: false,
      success: false,
      error: undefined,
    },
    deleteCollection: {
      pending: false,
      success: false,
      error: undefined,
    },
    fetchCollection: {
      pending: false,
      success: false,
      error: undefined,
    },
    updateCollectionBimObjects: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
};

const initialState = Immutable(baseState);

const collectionsReducer = (state = initialState, action: CollectionsActions) => {
  switch (action.type) {
    case FETCH_COLLECTIONS:
      return state
        .setIn(['api', 'fetchCollections', 'pending'], true)
        .setIn(['api', 'fetchCollections', 'success'], false)
        .setIn(['api', 'fetchCollections', 'error'], undefined);
    case FETCH_COLLECTIONS_SUCCESS:
      return state
        .setIn(['api', 'fetchCollections', 'pending'], false)
        .setIn(['api', 'fetchCollections', 'success'], true)
        .setIn(['api', 'fetchCollections', 'error'], undefined)
        .setIn(['collections'], action.collections);
    case FETCH_COLLECTIONS_ERROR:
      return state
        .setIn(['api', 'fetchCollections', 'pending'], false)
        .setIn(['api', 'fetchCollections', 'success'], false)
        .setIn(['api', 'fetchCollections', 'error'], action.error);
    case SET_FILTER_SEARCH:
      return state.setIn(['filter', 'search'], action.search);
    case CREATE_COLLECTION:
      return state
        .setIn(['api', 'createCollection', 'pending'], true)
        .setIn(['api', 'createCollection', 'success'], false)
        .setIn(['api', 'createCollection', 'error'], undefined);
    case CREATE_COLLECTION_SUCCESS:
      return state
        .setIn(['api', 'createCollection', 'pending'], false)
        .setIn(['api', 'createCollection', 'success'], true)
        .setIn(['api', 'createCollection', 'error'], undefined);
    case CREATE_COLLECTION_ERROR:
      return state
        .setIn(['api', 'createCollection', 'pending'], false)
        .setIn(['api', 'createCollection', 'success'], false)
        .setIn(['api', 'createCollection', 'error'], action.error);
    case UPDATE_COLLECTION:
      return state
        .setIn(['collections'], updateCollection(state.collections, action.collection))
        .setIn(['api', 'updateCollection', 'pending'], true)
        .setIn(['api', 'updateCollection', 'success'], false)
        .setIn(['api', 'updateCollection', 'error'], undefined);
    case UPDATE_COLLECTION_SUCCESS:
      return state
        .setIn(['api', 'updateCollection', 'pending'], false)
        .setIn(['api', 'updateCollection', 'success'], true)
        .setIn(['api', 'updateCollection', 'error'], undefined);
    case UPDATE_COLLECTION_ERROR:
      return state
        .setIn(['api', 'updateCollection', 'pending'], false)
        .setIn(['api', 'updateCollection', 'success'], false)
        .setIn(['api', 'updateCollection', 'error'], action.error);
    case DELETE_COLLECTION:
      return state
        .setIn(['collections'], deleteCollection(state.collections, action.collectionId))
        .setIn(['api', 'deleteCollection', 'pending'], true)
        .setIn(['api', 'deleteCollection', 'success'], false)
        .setIn(['api', 'deleteCollection', 'error'], undefined);
    case DELETE_COLLECTION_SUCCESS:
      return state
        .setIn(['api', 'deleteCollection', 'pending'], false)
        .setIn(['api', 'deleteCollection', 'success'], true)
        .setIn(['api', 'deleteCollection', 'error'], undefined);
    case DELETE_COLLECTION_ERROR:
      return state
        .setIn(['api', 'deleteCollection', 'pending'], false)
        .setIn(['api', 'deleteCollection', 'success'], false)
        .setIn(['api', 'deleteCollection', 'error'], action.error);
    case FETCH_COLLECTION:
      return state
        .setIn(['api', 'fetchCollection', 'pending'], true)
        .setIn(['api', 'fetchCollection', 'success'], false)
        .setIn(['api', 'fetchCollection', 'error'], undefined);
    case FETCH_COLLECTION_SUCCESS:
      return state
        .setIn(['api', 'fetchCollection', 'pending'], false)
        .setIn(['api', 'fetchCollection', 'success'], true)
        .setIn(['api', 'fetchCollection', 'error'], undefined)
        .setIn(['collection'], action.collection);
    case FETCH_COLLECTION_ERROR:
      return state
        .setIn(['api', 'fetchCollection', 'pending'], false)
        .setIn(['api', 'fetchCollection', 'success'], false)
        .setIn(['api', 'fetchCollection', 'error'], action.error);
    case UPDATE_COLLECTION_BIMOBJECTS:
      return state
        .update('collection', (collection) => {
          if (!collection?.IsFavorite) {
            return collection;
          }

          // Update favorites collection statistics when we update bim objects from favorites
          const nbBimObjectsRemoved = action.bimObjects?.filter((b) => !b.IsFavorite).length;
          const nbBimObjectsAdded = action.bimObjects?.length - nbBimObjectsRemoved;
          const newNbBimObjects =
            collection?.Statistics?.NbBimObjects + nbBimObjectsAdded - nbBimObjectsRemoved;

          return {
            ...collection,
            Statistics: {
              ...collection?.Statistics,
              NbBimObjects: newNbBimObjects,
            },
          };
        })
        .setIn(['api', 'updateCollectionBimObjects', 'pending'], true)
        .setIn(['api', 'updateCollectionBimObjects', 'success'], false)
        .setIn(['api', 'updateCollectionBimObjects', 'error'], undefined);
    case UPDATE_COLLECTION_BIMOBJECTS_SUCCESS:
      return state
        .setIn(['api', 'updateCollectionBimObjects', 'pending'], false)
        .setIn(['api', 'updateCollectionBimObjects', 'success'], true)
        .setIn(['api', 'updateCollectionBimObjects', 'error'], undefined);
    case UPDATE_COLLECTION_BIMOBJECTS_ERROR:
      return state
        .setIn(['api', 'updateCollectionBimObjects', 'pending'], false)
        .setIn(['api', 'updateCollectionBimObjects', 'success'], false)
        .setIn(['api', 'updateCollectionBimObjects', 'error'], action.error);
    default:
      return state;
  }
};

export default collectionsReducer;