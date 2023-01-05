import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_PROPERTIES,
  FetchPropertiesAction,
  DELETE_PROPERTY,
  DeletePropertyAction,
  ADD_PROPERTIES,
  AddPropertiesAction,
  Property,
} from './types';
import {
  fetchPropertiesSuccess,
  fetchPropertiesError,
  deletePropertySuccess,
  deletePropertyError,
  addPropertiesSuccess,
  addPropertiesError,
} from './actions';
import { selectLanguageCode, selectManagementCloudId } from '../../app/selectors';
import API from './api';

function* fetchProperties({ bimObjectId }: FetchPropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const properties: Property[] = yield call(API.get, languageCode, onflyId, bimObjectId);
    yield put(fetchPropertiesSuccess(properties));
  } catch (error) {
    yield put(fetchPropertiesError(error as string));
  }
}

function* deleteProperty({ bimObjectId, propertyId }: DeletePropertyAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.deleteProperty, languageCode, onflyId, bimObjectId, propertyId);
    yield put(deletePropertySuccess());
  } catch (error) {
    yield put(deletePropertyError(error as string));
  }
}

function* addProperties({ bimObjectId, properties }: AddPropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.add, languageCode, onflyId, bimObjectId, properties);
    yield put(addPropertiesSuccess());
  } catch (error) {
    yield put(addPropertiesError(error as string));
  }
}

const sagas = [
  takeLatest(FETCH_PROPERTIES, fetchProperties),
  takeLatest(DELETE_PROPERTY, deleteProperty),
  takeLatest(ADD_PROPERTIES, addProperties),
];

export default sagas;