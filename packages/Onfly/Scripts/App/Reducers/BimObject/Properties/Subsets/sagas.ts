import { call, put, select, takeLatest } from 'redux-saga/effects';

import { AddSubsetAction, ADD_SUBSET, RemoveSubsetAction, REMOVE_SUBSET } from './types';

import {
  addSubsetSuccess,
  addSubsetError,
  removeSubsetSuccess,
  removeSubsetError,
} from './actions';

import API from './api';
import { selectManagementCloudId } from '../../../app/selectors';

function* addSubset({ bimObjectId, property, subset }: AddSubsetAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(API.create, onflyId, bimObjectId, property, subset);
    yield put(addSubsetSuccess());
  } catch (error) {
    yield put(addSubsetError(error as string));
  }
}
function* removeSubset({ bimObjectId, property, subset }: RemoveSubsetAction) {
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(API.remove, onflyId, bimObjectId, property, subset);
    yield put(removeSubsetSuccess());
  } catch (error) {
    yield put(removeSubsetError(error as string));
  }
}

export default [takeLatest(ADD_SUBSET, addSubset), takeLatest(REMOVE_SUBSET, removeSubset)];