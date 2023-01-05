import { select, call, put, takeLatest } from 'redux-saga/effects';

import {
  CREATE_SPACE,
  FETCH_SPACES,
  DELETE_SPACE,
  UPDATE_SPACE,
  ASK_AUTHORIZATION,
} from './constants';

import {
  fetchSpacesSuccess,
  fetchSpacesError,
  deleteSpaceSuccess,
  deleteSpaceError,
  createSpaceSuccess,
  createSpaceError,
  updateSpaceSuccess,
  updateSpaceError,
  askAuthorizationSuccess,
  askAuthorizationError,
} from './actions';

import {
  selectLanguageCode,
  selectManagementCloudId,
  selectRoles,
  selectSubDomain,
  selectUser,
} from '../app/selectors';

import API from './api';
import {
  CreateSpaceAction,
  Space,
  DeleteSpaceAction,
  UpdateSpaceAction,
  AskAuthorizationAction,
  AccessRequest,
} from './types';
import { spaceMapping } from './utils';
import { RoleKey } from '../Roles/types';
import { User } from '../app/types';

function* fetchSpaces() {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const spaces: Space[] = yield call(API.list, languageCode, onflyId);
    yield put(fetchSpacesSuccess(spaces));
  } catch (error) {
    yield put(fetchSpacesError(error as string));
  }
}

function* createSpace({ space }: CreateSpaceAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);
  const subDomain: number = yield select(selectSubDomain);
  const user = yield select(selectUser);
  const roles = yield select(selectRoles);

  const adminRole = roles[languageCode].find((role) => role.RoleKey === RoleKey.admin);

  try {
    const { Id } = yield call(API.create, languageCode, onflyId, space);
    const newSpace: Space = spaceMapping(Id, space, subDomain, user, adminRole);
    yield put(createSpaceSuccess(newSpace));
  } catch (error) {
    yield put(createSpaceError(error.message as string));
  }
}

function* deleteSpace({ spaceId }: DeleteSpaceAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.deleteSpace, languageCode, onflyId, spaceId);
    yield put(deleteSpaceSuccess());
  } catch (error) {
    yield put(deleteSpaceError(error as string));
  }
}

function* updateSpace({ space }: UpdateSpaceAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(API.updateSpace, languageCode, onflyId, space);
    yield put(updateSpaceSuccess());
  } catch (error) {
    yield put(updateSpaceError(error as string));
  }
}

function* askAuthorization({ spaceId }: AskAuthorizationAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const user: User = yield select(selectUser);

  try {
    const accessRequest: AccessRequest = yield call(
      API.askAuthorization,
      languageCode,
      spaceId,
      user
    );
    yield put(askAuthorizationSuccess(spaceId, accessRequest.Id));
  } catch (error) {
    yield put(askAuthorizationError(error as string));
  }
}

export default [
  takeLatest(FETCH_SPACES, fetchSpaces),
  takeLatest(CREATE_SPACE, createSpace),
  takeLatest(DELETE_SPACE, deleteSpace),
  takeLatest(UPDATE_SPACE, updateSpace),
  takeLatest(ASK_AUTHORIZATION, askAuthorization),
];