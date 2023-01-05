import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_DOCUMENTS,
  FetchDocumentsAction,
  CreateDocumentAction,
  DocumentSource,
  CREATE_DOCUMENT,
  UpdateDocumentAction,
  UPDATE_DOCUMENT,
  DocumentRead,
  DeleteDocumentAction,
  DELETE_DOCUMENT,
} from './types';
import {
  fetchDocuments as fetchDocumentsAction,
  fetchDocumentsSuccess,
  fetchDocumentsError,
  createDocumentError,
  updateDocumentError,
  createDocumentSuccess,
  updateDocumentSuccess,
  deleteDocumentError,
  deleteDocumentSuccess,
} from './actions';
import { selectLanguageCode, selectToken, selectManagementCloudId } from '../../app/selectors';
import API from './api';

function* fetchDocuments({ bimObjectId }: FetchDocumentsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);

  try {
    const documents = yield call(API.get, languageCode, token, bimObjectId);
    yield put(fetchDocumentsSuccess(documents as DocumentRead[]));
  } catch (error) {
    yield put(fetchDocumentsError(error as string));
  }
}

function* createDocument({ document, source, bimObjectId }: CreateDocumentAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    if (source === DocumentSource.File) {
      yield call(API.postFile, languageCode, token, document, bimObjectId, onflyId);
    } else {
      yield call(API.postUrl, languageCode, token, document, bimObjectId, onflyId);
    }
    yield put(createDocumentSuccess());
    yield put(fetchDocumentsAction(bimObjectId));
  } catch (error) {
    yield put(createDocumentError(error as Error));
  }
}

function* updateDocument({ document, bimObjectId }: UpdateDocumentAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    if (document.IsInternal) {
      yield call(API.putFile, languageCode, token, document, bimObjectId, onflyId);
    } else {
      yield call(API.putUrl, languageCode, token, document, bimObjectId, onflyId);
    }
    yield put(updateDocumentSuccess());
    yield put(fetchDocumentsAction(bimObjectId));
  } catch (error) {
    yield put(updateDocumentError(error as Error));
  }
}

function* deleteDocument({ document, bimObjectId }: DeleteDocumentAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);

  try {
    if (document.IsInternal) {
      yield call(API.deleteFile, languageCode, token, document, bimObjectId);
    } else {
      yield call(API.deleteUrl, languageCode, token, document, bimObjectId);
    }
    yield put(deleteDocumentSuccess());
    yield put(fetchDocumentsAction(bimObjectId));
  } catch (error) {
    yield put(deleteDocumentError(error as Error));
  }
}

const sagas = [
  takeLatest(FETCH_DOCUMENTS, fetchDocuments),
  takeLatest(CREATE_DOCUMENT, createDocument),
  takeLatest(UPDATE_DOCUMENT, updateDocument),
  takeLatest(DELETE_DOCUMENT, deleteDocument),
];

export default sagas;