import { select, call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_PROPERTIES,
  FetchPropertiesAction,
  ADD_PROPERTIES,
  AddPropertiesAction,
  UPDATE_PROPERTY_SUBSETS,
  UpdatePropertySubsetsAction,
  DELETE_PROPERTIES,
  DeletePropertiesAction,
  Property,
} from './types';

import {
  fetchPropertiesSuccess,
  fetchPropertiesError,
  updatePropertySubsetsSuccess,
  updatePropertySubsetsError,
  deletePropertiesSuccess,
  deletePropertiesError,
  addPropertiesSuccess,
  addPropertiesError,
} from './actions';

import {
  selectLanguageCode,
  selectManagementCloudId,
  selectTranslatedResources,
} from '../../app/selectors';
import API from './api';

// Properties list of set
function* fetchProperties({ setId }: FetchPropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const properties: Property[] = yield call(API.getList, languageCode, onflyId, setId);
    yield put(fetchPropertiesSuccess(properties));
  } catch (error) {
    yield put(fetchPropertiesError(error as string));
  }
}
function* addProperties({ setId, properties }: AddPropertiesAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(API.addProperties, onflyId, setId, properties);
    yield put(addPropertiesSuccess());
  } catch (error) {
    yield put(addPropertiesError(error as string));
  }
}

// Update property subsets
function* updatePropertySubsets({
  setId,
  propertyId,
  subsets,
  keepPropertiesWithValue,
}: UpdatePropertySubsetsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);
  const resources = yield select(selectTranslatedResources);

  try {
    yield call(
      API.updateSubsets,
      languageCode,
      onflyId,
      setId,
      propertyId,
      subsets,
      keepPropertiesWithValue
    );

    yield put(updatePropertySubsetsSuccess());
  } catch (error) {
    const errorMessage = error.message
      ? error.message
      : resources.ContentManagement.UpdatePropertySubsetsFailed;

    yield put(updatePropertySubsetsError(errorMessage as string, propertyId));
  }
}

// Delete properties of set
function* deleteProperties({ setId, properties, keepPropertiesWithValue }: DeletePropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(
      API.deleteProperties,
      languageCode,
      onflyId,
      setId,
      properties,
      keepPropertiesWithValue
    );

    yield put(deletePropertiesSuccess());
  } catch (error) {
    yield put(deletePropertiesError(error as string));
  }
}
export default [
  takeLatest(FETCH_PROPERTIES, fetchProperties),
  takeLatest(ADD_PROPERTIES, addProperties),
  takeLatest(UPDATE_PROPERTY_SUBSETS, updatePropertySubsets),
  takeLatest(DELETE_PROPERTIES, deleteProperties),
];