import { select, call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_COLLECTIONS,
  CREATE_COLLECTION,
  UPDATE_COLLECTION,
  DELETE_COLLECTION,
  FETCH_COLLECTION,
  UPDATE_COLLECTION_BIMOBJECTS,
} from './constants';

import {
  fetchCollectionsSuccess,
  fetchCollectionsError,
  createCollectionSuccess,
  createCollectionError,
  updateCollectionSuccess,
  updateCollectionError,
  deleteCollectionSuccess,
  deleteCollectionError,
  fetchCollectionSuccess,
  fetchCollectionError,
  updateCollectionBimObjectsError,
  updateCollectionBimObjectsSuccess,
} from './actions';

import { selectLanguageCode, selectManagementCloudId } from '../app/selectors';

import API from './api';
import {
  CreateCollectionAction,
  UpdateCollectionAction,
  DeleteCollectionAction,
  FetchCollectionAction,
  UpdateCollectionBimObjectsAction,
  Collection,
} from './types';

function* fetchCollections() {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const collections: Collection[] = yield call(API.list, languageCode, onflyId);
    yield put(fetchCollectionsSuccess(collections));
  } catch (error) {
    yield put(fetchCollectionsError(error as string));
  }
}

function* createCollection({ collection }: CreateCollectionAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.create, languageCode, onflyId, collection);
    yield put(createCollectionSuccess());
  } catch (error) {
    yield put(createCollectionError(error as string));
  }
}

function* updateCollection({ collection }: UpdateCollectionAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.update, languageCode, onflyId, collection);
    yield put(updateCollectionSuccess());
  } catch (error) {
    yield put(updateCollectionError(error as string));
  }
}

function* deleteCollection({ collectionId }: DeleteCollectionAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.deleteCollection, languageCode, onflyId, collectionId);
    yield put(deleteCollectionSuccess());
  } catch (error) {
    yield put(deleteCollectionError(error as string));
  }
}

function* fetchCollection({ collectionId }: FetchCollectionAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const collection: Collection = yield call(API.get, languageCode, onflyId, collectionId);
    yield put(fetchCollectionSuccess(collection));
  } catch (error) {
    yield put(fetchCollectionError(error as string));
  }
}

function* updateCollectionBimObjects({ bimObjects }: UpdateCollectionBimObjectsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.updateBimObjects, languageCode, onflyId, bimObjects);
    yield put(updateCollectionBimObjectsSuccess());
  } catch (error) {
    yield put(updateCollectionBimObjectsError(error as string));
  }
}

export default [
  takeLatest(FETCH_COLLECTIONS, fetchCollections),
  takeLatest(CREATE_COLLECTION, createCollection),
  takeLatest(UPDATE_COLLECTION, updateCollection),
  takeLatest(DELETE_COLLECTION, deleteCollection),
  takeLatest(FETCH_COLLECTION, fetchCollection),
  takeLatest(UPDATE_COLLECTION_BIMOBJECTS, updateCollectionBimObjects),
];