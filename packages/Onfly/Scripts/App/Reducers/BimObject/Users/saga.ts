import { select, call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_AUTHORIZATION, FetchAuthorizationAction, UserEditorAuthorization } from './types';
import { fetchAuthorizationSuccess, fetchAuthorizationError } from './actions';
import { selectLanguageCode, selectToken } from '../../app/selectors';
import API from './api';

function* fetchAuthorization({ bimObjectId }: FetchAuthorizationAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);

  try {
    const authorizations: UserEditorAuthorization = yield call(
      API.get,
      token,
      languageCode,
      bimObjectId
    );
    yield put(fetchAuthorizationSuccess(authorizations));
  } catch (error) {
    yield put(fetchAuthorizationError(error as string));
  }
}

const sagas = [takeLatest(FETCH_AUTHORIZATION, fetchAuthorization)];

export default sagas;