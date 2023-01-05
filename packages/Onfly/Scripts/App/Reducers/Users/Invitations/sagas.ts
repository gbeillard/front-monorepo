import { select, call, put, takeLatest } from 'redux-saga/effects';

import { FETCH_INVITATIONS, InvitationDetails } from './types';

import { fetchInvitationsSuccess, fetchInvitationsError } from './actions';

import { selectLanguageCode, selectManagementCloudId } from '../../app/selectors';

import API from './api';

function* fetchInvitations() {
  const languageCode: string = yield select(selectLanguageCode);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    const invitations: InvitationDetails[] = yield call(API.list, languageCode, onflyId);
    yield put(fetchInvitationsSuccess(invitations));
  } catch (error) {
    yield put(fetchInvitationsError(error as string));
  }
}

export default [takeLatest(FETCH_INVITATIONS, fetchInvitations)];