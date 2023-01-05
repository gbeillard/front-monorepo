import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  FETCH_PROPERTIES,
  UPDATE_PROPERTY,
  DELETE_PROPERTY,
  ADD_PROPERTIES,
  FetchPropertiesAction,
  UpdatePropertyAction,
  DeletePropertyAction,
  AddPropertiesAction,
} from './types';
import API from './api';
import {
  fetchPropertiesSuccess,
  fetchPropertiesError,
  updatePropertySuccess,
  updatePropertyError,
  deletePropertySuccess,
  deletePropertyError,
  addPropertiesSuccess,
  addPropertiesError,
} from './actions';

import { selectLanguageCode, selectManagementCloudId } from '../../app/selectors';
import { LanguageCode } from '../../app/types';

function* fetchProperties({ classificationId, nodeId }: FetchPropertiesAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguageCode);
  try {
    const properties = yield call(API.fetchProperties, language, onflyId, classificationId, nodeId);
    yield put(fetchPropertiesSuccess(properties));
  } catch (error) {
    yield put(fetchPropertiesError(error));
  }
}

function* addProperties({ classificationId, nodeId, properties }: AddPropertiesAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguageCode);
  try {
    yield call(API.addProperties, language, onflyId, classificationId, nodeId, properties);
    yield put(addPropertiesSuccess());
  } catch (error) {
    yield put(addPropertiesError(error as string));
  }
}

function* updateProperty({ classificationId, nodeId, property }: UpdatePropertyAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguageCode);
  try {
    yield call(API.updateProperty, language, onflyId, classificationId, nodeId, property);
    yield put(updatePropertySuccess());
  } catch (error) {
    yield put(updatePropertyError(error));
  }
}

function* deleteProperty({
  classificationId,
  nodeId,
  property,
  keepPropertiesWithValue,
}: DeletePropertyAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(
      API.deleteProperty,
      onflyId,
      classificationId,
      nodeId,
      property,
      keepPropertiesWithValue
    );
    yield put(deletePropertySuccess());
  } catch (error) {
    yield put(deletePropertyError(error));
  }
}

const propertiesSagas = [
  takeLatest(FETCH_PROPERTIES, fetchProperties),
  takeLatest(ADD_PROPERTIES, addProperties),
  takeLatest(UPDATE_PROPERTY, updateProperty),
  takeLatest(DELETE_PROPERTY, deleteProperty),
];

export default propertiesSagas;