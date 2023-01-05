import { select, call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_SUBSETS,
  FetchSubsetsAction,
  AddSubsetsAction,
  ADD_SUBSETS,
  RemoveSubsetAction,
  REMOVE_SUBSET,
} from './types';

import {
  fetchSubsets as fetchSubsetsAction,
  fetchSubsetsSuccess,
  fetchSubsetsError,
  addSubsetsSuccess,
  addSubsetsError,
  removeSubsetSuccess,
  removeSubsetError,
} from './actions';

import { fetchProperties as fetchPropertiesAction } from '../properties/actions';

import { selectLanguageCode, selectManagementCloudId } from '../../app/selectors';
import API from './api';
import { LanguageCode } from '../../app/types';
import { Subset } from '../../Sets/Subsets/types';

// Subsets list of set
function* fetchSubsets({ classificationId, nodeId }: FetchSubsetsAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguageCode);

  try {
    const subsets: Subset[] = yield call(API.list, language, onflyId, classificationId, nodeId);
    yield put(fetchSubsetsSuccess(subsets));
  } catch (error) {
    yield put(fetchSubsetsError(error as string));
  }
}

function* addSubsets({ classificationId, nodeId, subsets }: AddSubsetsAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguageCode);
  try {
    yield call(API.create, language, onflyId, classificationId, nodeId, subsets);
    yield put(addSubsetsSuccess());
    yield put(fetchPropertiesAction(classificationId, nodeId));
    yield put(fetchSubsetsAction(classificationId, nodeId));
  } catch (error) {
    yield put(addSubsetsError(error));
  }
}
function* removeSubset({
  classificationId,
  nodeId,
  subset,
  keepPropertiesWithValue,
}: RemoveSubsetAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(API.remove, onflyId, classificationId, nodeId, subset, keepPropertiesWithValue);
    yield put(removeSubsetSuccess());
    yield put(fetchPropertiesAction(classificationId, nodeId));
    yield put(fetchSubsetsAction(classificationId, nodeId));
  } catch (error) {
    yield put(removeSubsetError(error));
  }
}

export default [
  takeLatest(FETCH_SUBSETS, fetchSubsets),
  takeLatest(ADD_SUBSETS, addSubsets),
  takeLatest(REMOVE_SUBSET, removeSubset),
];