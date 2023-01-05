import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchDictionarySuccess,
  fetchDictionaryError,
  addOfficialPropertiesSuccess,
  addOfficialPropertiesError,
  duplicatePropertySuccess,
  duplicatePropertyError,
} from './actions';
import { API_URL } from '../../Api/constants';
import { selectLanguageCode, selectManagementCloudId, selectToken } from '../app/selectors';
import {
  FETCH_DICTIONARY,
  OfficialProperty,
  AddOfficialPropertiesAction,
  ADD_OFFICIAL_PROPERTIES,
  DuplicatedProperty,
  DuplicatePropertyAction,
  DUPLICATE_PROPERTY,
  Property,
} from './types';
import { mapProperties } from './utils';

const fetchDictionaryRequest = async (languageCode: string, onflyId: number, token: string) => {
  const body = {
    Search: '',
    IsDictionaryMapping: true,
    IsDictionaryPaging: true,
    CurrentPaging: {
      From: 0,
      Size: 1000000,
    },
    CurrentSorting: {
      Name: 'sortName',
      Order: 'asc',
    },
  };
  const response = await fetch(
    `${API_URL}/api/ws/v1/${languageCode}/contentmanagement/${onflyId}/dictionary/properties/edit/list?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return response.json();
};

const addOfficialPropertiesRequest = async (
  languageCode: string,
  onflyId: number,
  token: string,
  properties: OfficialProperty[]
) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/${languageCode}/contentmanagement/${onflyId}/dictionary/properties/associate?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        CurrentFileName: 'Bim and Co properties',
        PropertiesTemplateModelList: properties,
      }),
    }
  );
  return response.json();
};

const duplicatePropertyRequest = async (
  languageCode: string,
  onflyId: number,
  token: string,
  property: DuplicatedProperty
) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/${languageCode}/contentmanagement/${onflyId}/dictionary/properties/duplicate?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property),
    }
  );
  return response.status === 200;
};

function* fetchDictionary() {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);
  const token: string = yield select(selectToken);
  try {
    const properties: Property[] = yield call(fetchDictionaryRequest, languageCode, onflyId, token);
    yield put(fetchDictionarySuccess(properties));
  } catch (error) {
    yield put(fetchDictionaryError(error as string));
  }
}

function* addOfficialProperties({ properties }: AddOfficialPropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);
  const token: string = yield select(selectToken);

  const mappedProperties = mapProperties(properties, languageCode);
  try {
    yield call(addOfficialPropertiesRequest, languageCode, onflyId, token, mappedProperties);
    yield put(addOfficialPropertiesSuccess());
  } catch (error) {
    yield put(addOfficialPropertiesError(error as Error));
  }
}

function* duplicateProperty({ property }: DuplicatePropertyAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);
  const token: string = yield select(selectToken);

  try {
    const ok = yield call(duplicatePropertyRequest, languageCode, onflyId, token, property);
    if (!ok) {
      throw Error('Something went wrong');
    }
    yield put(duplicatePropertySuccess());
  } catch (error) {
    yield put(duplicatePropertyError(error as Error));
  }
}

const sagas = [
  takeLatest(FETCH_DICTIONARY, fetchDictionary),
  takeLatest(ADD_OFFICIAL_PROPERTIES, addOfficialProperties),
  takeLatest(DUPLICATE_PROPERTY, duplicateProperty),
];

export default sagas;