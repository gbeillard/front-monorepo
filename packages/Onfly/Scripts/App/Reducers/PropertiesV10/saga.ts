import { select, call, put, takeLatest } from 'redux-saga/effects';

import { FETCH_ALL_PROPERTIES, FetchAllPropertiesAction, Property } from './types';

import { fetchPropertiesSuccess, fetchPropertiesError } from './actions';

import { selectLanguageCode, selectManagementCloudId } from '../app/selectors';
import API from './api';

// All dictionaries Properties list
// eslint-disable-next-line no-empty-pattern
function* fetchAllProperties({
  mappingConfigurationId,
  mappingConfigurationLanguage,
  mappingDictionaryLanguage,
}: FetchAllPropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const properties: Property[] = yield call(
      API.getAllList,
      languageCode,
      onflyId,
      mappingConfigurationId,
      mappingConfigurationLanguage,
      mappingDictionaryLanguage,
    );
    yield put(fetchPropertiesSuccess(properties));
  } catch (error) {
    yield put(fetchPropertiesError(error as string));
  }
}

export default [takeLatest(FETCH_ALL_PROPERTIES, fetchAllProperties)];