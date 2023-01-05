import { select, call, put, takeLatest } from 'redux-saga/effects';

import {
  Subset,
  FETCH_SUBSETS,
  FetchSubsetsAction,
  FETCH_ALL_SUBSETS,
  FetchAllSubsetsAction,
  CREATE_SUBSET,
  CreateSubsetAction,
  ADD_SUBSET_PROPERTIES,
  AddSubsetPropertiesAction,
  DELETE_SUBSET_PROPERTIES,
  DeleteSubsetPropertiesAction,
  UPDATE_SUBSET_TWO_D_MODEL_REFERENCE,
  UpdateSubsetTwoDModelReferenceAction,
  UPDATE_SUBSET_THREE_D_MODEL_REFERENCE,
  UpdateSubsetThreeDModelReferenceAction,
} from './types';

import {
  fetchSubsetsSuccess,
  fetchSubsetsError,
  fetchAllSubsetsSuccess,
  fetchAllSubsetsError,
  createSubsetSuccess,
  createSubsetError,
  addSubsetPropertiesSuccess,
  addSubsetPropertiesError,
  deleteSubsetPropertiesSuccess,
  deleteSubsetPropertiesError,
  updateSubsetTwoDModelReferenceSuccess,
  updateSubsetTwoDModelReferenceError,
  updateSubsetThreeDModelReferenceSuccess,
  updateSubsetThreeDModelReferenceError,
} from './actions';

import { selectLanguageCode, selectManagementCloudId } from '../../app/selectors';
import API from './api';

// Subsets list of set
function* fetchSubsets({ setId }: FetchSubsetsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const subsets: Subset[] = yield call(API.list, languageCode, onflyId, setId);
    yield put(fetchSubsetsSuccess(subsets));
  } catch (error) {
    yield put(fetchSubsetsError(error as string));
  }
}

// onFly Subsets list
// eslint-disable-next-line no-empty-pattern
function* fetchAllSubsets({ }: FetchAllSubsetsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const subsets: Subset[] = yield call(API.listAll, languageCode, onflyId);
    yield put(fetchAllSubsetsSuccess(subsets));
  } catch (error) {
    yield put(fetchAllSubsetsError(error as string));
  }
}

// Create a subset
function* createSubset({ setId, subset, properties }: CreateSubsetAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const subsetIds = yield call(API.create, languageCode, onflyId, setId, [subset]);

    // Subset created
    const newSubset: Subset = {
      ...subset,
      Id: subsetIds?.Ids[0]?.Id ?? 0,
    };

    yield put(createSubsetSuccess(newSubset, properties));
  } catch (error) {
    yield put(createSubsetError(error as string));
  }
}

// Add properties to a subset
function* addSubsetProperties({ setId, subsetId, propertyIds }: AddSubsetPropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.addProperties, languageCode, onflyId, setId, subsetId, propertyIds);

    yield put(addSubsetPropertiesSuccess());
  } catch (error) {
    yield put(addSubsetPropertiesError(error as string));
  }
}

// Delete properties in subset
function* deleteSubsetProperties({
  setId,
  subsetId,
  propertyIds,
  keepPropertiesWithValue,
}: DeleteSubsetPropertiesAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(
      API.deleteProperties,
      languageCode,
      onflyId,
      setId,
      subsetId,
      propertyIds,
      keepPropertiesWithValue
    );

    yield put(deleteSubsetPropertiesSuccess());
  } catch (error) {
    yield put(deleteSubsetPropertiesError(error as string));
  }
}

// update Subset On TwoD Model Reference
function* updateSubsetOnTwoDModelReference({
  bimObjectId,
  modelId,
  variantId,
  subsetsIds,
}: UpdateSubsetTwoDModelReferenceAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(
      API.updateSubsetTwoDModelReference,
      languageCode,
      onflyId,
      bimObjectId,
      modelId,
      variantId,
      subsetsIds
    );

    yield put(updateSubsetTwoDModelReferenceSuccess());
  } catch (error) {
    yield put(updateSubsetTwoDModelReferenceError(error as string));
  }
}

// update Subset On ThreeD Model Reference
function* updateSubsetOnThreeDModelReference({
  bimObjectId,
  modelId,
  variantId,
  subsetsIds,
}: UpdateSubsetThreeDModelReferenceAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(
      API.updateSubsetThreeDModelReference,
      languageCode,
      onflyId,
      bimObjectId,
      modelId,
      variantId,
      subsetsIds
    );

    yield put(updateSubsetThreeDModelReferenceSuccess());
  } catch (error) {
    yield put(updateSubsetThreeDModelReferenceError(error as string));
  }
}

export default [
  takeLatest(FETCH_SUBSETS, fetchSubsets),
  takeLatest(FETCH_ALL_SUBSETS, fetchAllSubsets),
  takeLatest(CREATE_SUBSET, createSubset),
  takeLatest(ADD_SUBSET_PROPERTIES, addSubsetProperties),
  takeLatest(DELETE_SUBSET_PROPERTIES, deleteSubsetProperties),
  takeLatest(UPDATE_SUBSET_TWO_D_MODEL_REFERENCE, updateSubsetOnTwoDModelReference),
  takeLatest(UPDATE_SUBSET_THREE_D_MODEL_REFERENCE, updateSubsetOnThreeDModelReference),
];