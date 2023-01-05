import { takeLatest, call, select, put } from 'redux-saga/effects';

import {
  SET_DOCUMENT_TITLE,
  SET_CRISP_METADATA,
  FETCH_DOCUMENT_TYPES,
  FETCH_LANGUAGES,
} from './constants';
import { SET_PERMANENT_TOKEN } from '../authentication/types';
import { selectToken } from './selectors';
import {
  fetchDocumentTypesSuccess,
  fetchDocumentTypesError,
  fetchLanguagesSuccess,
  fetchLanguagesError,
} from './actions';
import * as GeneralApi from '../../Api/GeneralApi';
import api from '../authentication/api';

function setDocumentTitle({ title }) {
  document.title = `${title} Onfly`;
}

function setCrispMetadata({ firstName, lastName, avatar }) {
  const name = `${firstName} ${lastName}`;
  const application = 'cm';

  $crisp.push(['set', 'user:nickname', [name]]);
  $crisp.push(['set', 'user:avatar', [avatar]]);
  $crisp.push(['set', 'session:data', [[['application', application]]]]);
}

function* fetchDocumentTypes() {
  const token = yield select(selectToken);

  try {
    const types = yield call(GeneralApi.fetchDocumentTypes, token);
    yield put(fetchDocumentTypesSuccess(types));
  } catch (error) {
    yield put(fetchDocumentTypesError(error));
  }
}

function* fetchLanguages() {
  try {
    const languages = yield call(GeneralApi.fetchLanguages);
    yield put(fetchLanguagesSuccess(languages));
  } catch (error) {
    yield put(fetchLanguagesError(error));
  }
}

function* fetchTemporaryToken() {
  try {
    const permanentToken = localStorage.getItem('Auth_token');
    const onflyId = localStorage.getItem('OnflyId');
    const responseTemporayToken = yield call(api.requestTemporaryToken, permanentToken, onflyId);
    if (responseTemporayToken?.UserId) {
      localStorage.removeItem('Auth_token'); // remove this token and swtich to classif auth method
      localStorage.setItem('Temporary_token', responseTemporayToken?.Token);
      localStorage.setItem('Refresh_token', responseTemporayToken?.RefreshToken);
      localStorage.setItem('UserId', responseTemporayToken?.UserId);
        // JM : Pour la migration vers le nouveau SSO
        localStorage.setItem('SubjectId', responseTemporayToken?.sub);
    }
  } catch (error) {
    console.error(error);
  }
}

const sagas = [
  takeLatest(SET_DOCUMENT_TITLE, setDocumentTitle),
  takeLatest(SET_CRISP_METADATA, setCrispMetadata),
  takeLatest(FETCH_DOCUMENT_TYPES, fetchDocumentTypes),
  takeLatest(FETCH_LANGUAGES, fetchLanguages),
  takeLatest(SET_PERMANENT_TOKEN, fetchTemporaryToken),
];

export default sagas;
