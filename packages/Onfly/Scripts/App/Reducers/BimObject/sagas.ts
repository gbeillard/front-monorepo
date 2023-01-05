import { select, call, put, takeLatest, delay } from 'redux-saga/effects';
import { ImmutableArray } from 'seamless-immutable';
import { v4 as generateUuid } from 'uuid';
import {
  SET_FILTER,
  SEARCH_OBJECTS,
  INCREASE_PAGINATION,
  SET_LIBRARIES,
  SET_SOFTWARE_FILTERS,
  SET_TAG_FILTERS,
  SET_LOD_FILTERS,
  SET_CLASSIFICATION_FILTERS,
  SET_MANUFACTURER_FILTERS,
  ADD_PROPERTY_FILTER,
  SET_PROPERTY_FILTER,
  REMOVE_PROPERTY_FILTER,
  RESET_SEARCH,
  SetLibrariesAction,
  ContentManagementLibrary,
  INITIALIZE_SEARCH,
  SET_CLASSIFICATION_NODE_FILTERS,
  FETCH_BIMOBJECT,
  FetchBimObjectAction,
  SearchRequest,
  SearchObjectsOptions,
  SET_GROUP_FILTERS,
  SearchResponse,
  SearchObjectGroup,
  BimObject,
  FETCH_COUNTRIES,
  SET_COUNTRIES_FILTER,
} from './types';
import { selectManagementCloudId, selectToken, selectLanguageCode } from '../app/selectors';
import API from './api';
import { CountryAPI, Country } from '../Country';
import { selectRequest, selectGroup, selectShowFilters } from './selectors';
import {
  searchObjects as searchObjectsAction,
  searchObjectsSuccess,
  searchObjectsError,
  searchObjectsStart,
  fetchBimObjectSuccess,
  fetchBimObjectError,
  fetchCountriesSuccess,
  fetchCountriesError,
} from './actions';

function* setFilter() {
  yield delay(1000); // debounce
  yield put(searchObjectsAction());
}

const getUpdatedOptions = (
  showFilters: boolean,
  options?: SearchObjectsOptions
): SearchObjectsOptions => {
  const withResults = options?.withResults !== false;
  const withFilters = options?.withFilters !== false || showFilters;
  return { withResults, withFilters };
};

const getRequestWithObjects = (request: SearchRequest, withObjects: boolean): SearchRequest => {
  if (withObjects) {
    return request;
  }

  return {
    ...request,
    SearchPaging: {
      ...request.SearchPaging,
      Size: 0,
    },
  };
};

const getRequestWithFilters = (request: SearchRequest, withFilters: boolean): SearchRequest => {
  if (withFilters) {
    return request;
  }

  return {
    ...request,
    StaticFilters: {},
    IgnoreFacets: true,
  };
};

const getRequest = (
  request: SearchRequest,
  id: string,
  languageCode: string,
  options: SearchObjectsOptions
) => {
  const withObjects = getRequestWithObjects(request, options.withResults);
  const withFilters = getRequestWithFilters(withObjects, options.withFilters);
  return {
    ...withFilters,
    Id: id,
    languageCode,
  };
};

export function* initializeSearch() {
  const options: SearchObjectsOptions = { withResults: true, withFilters: false };
  yield call(searchObjects, { options });
}

export function* increasePagination() {
  const options: SearchObjectsOptions = { withResults: true, withFilters: false };
  yield call(searchObjects, { options });
}

export function* searchObjects(action?: { options?: SearchObjectsOptions }) {
  yield delay(300); // debounce

  const onflyId: number = yield select(selectManagementCloudId);
  const token: string = yield select(selectToken);
  const request: SearchRequest = yield select(selectRequest);
  const group: SearchObjectGroup = yield select(selectGroup);
  const languageCode: string = yield select(selectLanguageCode);
  const showFilters: boolean = yield select(selectShowFilters);

  const id = generateUuid();

  const updatedOptions = getUpdatedOptions(showFilters, action?.options);
  const updatedRequest = getRequest(request, id, languageCode, updatedOptions);

  yield put(searchObjectsStart(id));
  try {
    const response: SearchResponse = yield call(API.search, updatedRequest, onflyId, token, group);
    yield put(searchObjectsSuccess(response, updatedOptions));
  } catch (error) {
    yield put(searchObjectsError(error as Error));
  }
}

export function* saveLibrariesInCache(libraries: ImmutableArray<ContentManagementLibrary>) {
  sessionStorage.setItem('searchLibraries', JSON.stringify(libraries));
}

export function* setLibraries({ libraries }: SetLibrariesAction) {
  yield call(saveLibrariesInCache, libraries);
  yield call(searchObjects);
}

function* fetchBimObject({ bimObjectId }: FetchBimObjectAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);

  try {
    const bimObject: BimObject = yield call(
      API.getBimObjectInformations,
      token,
      languageCode,
      bimObjectId
    );
    yield put(fetchBimObjectSuccess(bimObject));
  } catch (error) {
    yield put(fetchBimObjectError(error as string));
  }
}

function* fetchCountries() {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);

  try {
    const countries: Country[] = yield call(CountryAPI.fetchCountries, token, languageCode);
    yield put(fetchCountriesSuccess(countries));
  } catch (error) {
    yield put(fetchCountriesError(error as string));
  }
}

const sagas = [
  takeLatest(SET_FILTER, setFilter),
  takeLatest(INITIALIZE_SEARCH, initializeSearch),
  takeLatest(INCREASE_PAGINATION, increasePagination),
  takeLatest(SET_LIBRARIES, setLibraries),
  takeLatest(SEARCH_OBJECTS, searchObjects),
  takeLatest(SET_SOFTWARE_FILTERS, searchObjects),
  takeLatest(SET_TAG_FILTERS, searchObjects),
  takeLatest(SET_LOD_FILTERS, searchObjects),
  takeLatest(SET_CLASSIFICATION_FILTERS, searchObjects),
  takeLatest(SET_CLASSIFICATION_NODE_FILTERS, searchObjects),
  takeLatest(SET_MANUFACTURER_FILTERS, searchObjects),
  takeLatest(SET_COUNTRIES_FILTER, searchObjects),
  takeLatest(SET_GROUP_FILTERS, searchObjects),
  takeLatest(ADD_PROPERTY_FILTER, searchObjects),
  takeLatest(SET_PROPERTY_FILTER, searchObjects),
  takeLatest(REMOVE_PROPERTY_FILTER, searchObjects),
  takeLatest(RESET_SEARCH, searchObjects),
  takeLatest(FETCH_BIMOBJECT, fetchBimObject),
  takeLatest(FETCH_COUNTRIES, fetchCountries),
];

export default sagas;