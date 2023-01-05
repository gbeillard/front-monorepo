import { call, put, select, takeLatest } from 'redux-saga/effects';
import { selectManagementCloudId } from '../app/selectors';
import {
  fetchPreferencesError,
  fetchPreferencesSuccess,
  updatePreferencesError,
  updatePreferencesSuccess,
} from './actions';
import API from './api';
import {
  FETCH_PREFERENCES,
  Preferences,
  UpdatePreferencesAction,
  UPDATE_PREFERENCES,
} from './types';

function* fetchPreferences() {
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    const preferences: Preferences = yield call(API.get, onflyId);
    yield put(fetchPreferencesSuccess(preferences));
  } catch (error) {
    yield put(fetchPreferencesError(error as string));
  }
}

function* updatePreferences({ preferences }: UpdatePreferencesAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(API.update, onflyId, preferences);
    yield put(updatePreferencesSuccess());
  } catch (error) {
    yield put(updatePreferencesError(error as string));
  }
}

const preferencesSagas = [
  takeLatest(FETCH_PREFERENCES, fetchPreferences),
  takeLatest(UPDATE_PREFERENCES, updatePreferences),
];

export default preferencesSagas;