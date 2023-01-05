import { select, call, put, takeLatest } from 'redux-saga/effects';

import { FETCH_SET, FETCH_SETS } from './constants';

import { FetchSetAction, Set } from './types';

import { fetchSetSuccess, fetchSetError, fetchSetsSuccess, fetchSetsError } from './actions';

import { selectLanguageCode, selectManagementCloudId } from '../app/selectors';
import API from './api';

// Set informations
function* fetchSet({ id }: FetchSetAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const set: Set = yield call(API.get, languageCode, onflyId, id);
    yield put(fetchSetSuccess(set));
  } catch (error) {
    yield put(fetchSetError(error as string));
  }
}
function* fetchSets() {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const sets: Set[] = yield call(API.list, languageCode, onflyId);
    yield put(fetchSetsSuccess(sets));
  } catch (error) {
    yield put(fetchSetsError(error as string));
  }
}

export default [takeLatest(FETCH_SET, fetchSet), takeLatest(FETCH_SETS, fetchSets)];