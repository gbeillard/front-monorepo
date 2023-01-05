import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_SUBSETS,
  FetchSubsetsAction,
  DELETE_SUBSET,
  DeleteSubsetAction,
  ADD_SUBSETS,
  AddSubsetsAction,
} from './types';
import {
  fetchSubsetsSuccess,
  fetchSubsetsError,
  deleteSubsetSuccess,
  deleteSubsetError,
  addSubsetsSuccess,
  addSubsetsError,
} from './actions';
import { selectLanguageCode, selectManagementCloudId } from '../../app/selectors';
import API from './api';
import { Subset } from '../../Sets/Subsets/types';

function* fetchSubsets({ bimObjectId }: FetchSubsetsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const subsets: Subset[] = yield call(API.get, languageCode, onflyId, bimObjectId);
    yield put(fetchSubsetsSuccess(subsets));
  } catch (error) {
    yield put(fetchSubsetsError(error as string));
  }
}

function* deleteSubset({ bimObjectId, subsetId, keepPropertiesWithValue }: DeleteSubsetAction) {
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.deleteSubset, onflyId, bimObjectId, subsetId, keepPropertiesWithValue);
    yield put(deleteSubsetSuccess());
  } catch (error) {
    yield put(deleteSubsetError(error as string));
  }
}

function* addSubsets({ bimObjectId, subsets }: AddSubsetsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.add, languageCode, onflyId, bimObjectId, subsets);
    yield put(addSubsetsSuccess());
  } catch (error) {
    yield put(addSubsetsError(error as string));
  }
}

const sagas = [
  takeLatest(FETCH_SUBSETS, fetchSubsets),
  takeLatest(DELETE_SUBSET, deleteSubset),
  takeLatest(ADD_SUBSETS, addSubsets),
];

export default sagas;