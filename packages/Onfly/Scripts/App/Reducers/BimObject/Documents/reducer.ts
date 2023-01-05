import Immutable from 'seamless-immutable';
import {
  DocumentsActions,
  DocumentRead,
  FETCH_DOCUMENTS,
  FETCH_DOCUMENTS_SUCCESS,
  FETCH_DOCUMENTS_ERROR,
  CREATE_DOCUMENT,
  CREATE_DOCUMENT_SUCCESS,
  CREATE_DOCUMENT_ERROR,
  UPDATE_DOCUMENT,
  UPDATE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT_ERROR,
  DELETE_DOCUMENT,
  DELETE_DOCUMENT_SUCCESS,
  DELETE_DOCUMENT_ERROR,
} from './types';

export const baseState = {
  api: {
    fetchDocuments: {
      pending: false,
      success: false,
      error: undefined,
    },
    createDocument: {
      pending: false,
      success: false,
      error: undefined,
    },
    updateDocument: {
      pending: false,
      success: false,
      error: undefined,
    },
    deleteDocument: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
  documents: [] as DocumentRead[],
};

const initialState = Immutable(baseState);

const dictionaryReducer = (state = initialState, action: DocumentsActions) => {
  switch (action.type) {
    case FETCH_DOCUMENTS:
      return state
        .setIn(['api', 'fetchDocuments', 'pending'], true)
        .setIn(['api', 'fetchDocuments', 'success'], false)
        .setIn(['api', 'fetchDocuments', 'error'], undefined);
    case FETCH_DOCUMENTS_SUCCESS:
      return state
        .setIn(['api', 'fetchDocuments', 'pending'], false)
        .setIn(['api', 'fetchDocuments', 'success'], true)
        .setIn(['api', 'fetchDocuments', 'error'], undefined)
        .setIn(['documents'], action.documents);
    case FETCH_DOCUMENTS_ERROR:
      return state
        .setIn(['api', 'fetchDocuments', 'pending'], false)
        .setIn(['api', 'fetchDocuments', 'success'], false)
        .setIn(['api', 'fetchDocuments', 'error'], action.error);
    case CREATE_DOCUMENT:
      return state
        .setIn(['api', 'createDocument', 'pending'], true)
        .setIn(['api', 'createDocument', 'success'], false)
        .setIn(['api', 'createDocument', 'error'], undefined);
    case CREATE_DOCUMENT_SUCCESS:
      return state
        .setIn(['api', 'createDocument', 'pending'], false)
        .setIn(['api', 'createDocument', 'success'], true)
        .setIn(['api', 'createDocument', 'error'], undefined);
    case CREATE_DOCUMENT_ERROR:
      return state
        .setIn(['api', 'createDocument', 'pending'], false)
        .setIn(['api', 'createDocument', 'success'], false)
        .setIn(['api', 'createDocument', 'error'], action.error);
    case UPDATE_DOCUMENT:
      return state
        .setIn(['api', 'updateDocument', 'pending'], true)
        .setIn(['api', 'updateDocument', 'success'], false)
        .setIn(['api', 'updateDocument', 'error'], undefined);
    case UPDATE_DOCUMENT_SUCCESS:
      return state
        .setIn(['api', 'updateDocument', 'pending'], false)
        .setIn(['api', 'updateDocument', 'success'], true)
        .setIn(['api', 'updateDocument', 'error'], undefined);
    case UPDATE_DOCUMENT_ERROR:
      return state
        .setIn(['api', 'updateDocument', 'pending'], false)
        .setIn(['api', 'updateDocument', 'success'], false)
        .setIn(['api', 'updateDocument', 'error'], action.error);
    case DELETE_DOCUMENT:
      return state
        .setIn(['api', 'deleteDocument', 'pending'], true)
        .setIn(['api', 'deleteDocument', 'success'], false)
        .setIn(['api', 'deleteDocument', 'error'], undefined);
    case DELETE_DOCUMENT_SUCCESS:
      return state
        .setIn(['api', 'deleteDocument', 'pending'], false)
        .setIn(['api', 'deleteDocument', 'success'], true)
        .setIn(['api', 'deleteDocument', 'error'], undefined);
    case DELETE_DOCUMENT_ERROR:
      return state
        .setIn(['api', 'deleteDocument', 'pending'], false)
        .setIn(['api', 'deleteDocument', 'success'], false)
        .setIn(['api', 'deleteDocument', 'error'], action.error);
    default:
      return state;
  }
};

export default dictionaryReducer;