import {
  FETCH_DOCUMENTS,
  FetchDocumentsAction,
  FETCH_DOCUMENTS_SUCCESS,
  FetchDocumentsSuccessAction,
  FETCH_DOCUMENTS_ERROR,
  FetchDocumentsErrorAction,
  DocumentRead,
  DocumentWrite,
  DocumentSource,
  CreateDocumentAction,
  CREATE_DOCUMENT,
  CreateDocumentSuccessAction,
  CREATE_DOCUMENT_SUCCESS,
  CreateDocumentErrorAction,
  CREATE_DOCUMENT_ERROR,
  UpdateDocumentAction,
  UPDATE_DOCUMENT,
  UpdateDocumentSuccessAction,
  UPDATE_DOCUMENT_SUCCESS,
  UpdateDocumentErrorAction,
  UPDATE_DOCUMENT_ERROR,
  DeleteDocumentAction,
  DELETE_DOCUMENT,
  DELETE_DOCUMENT_SUCCESS,
  DeleteDocumentSuccessAction,
  DeleteDocumentErrorAction,
  DELETE_DOCUMENT_ERROR,
} from './types';

export const fetchDocuments = (bimObjectId: number): FetchDocumentsAction => ({
  type: FETCH_DOCUMENTS,
  bimObjectId,
});

export const fetchDocumentsSuccess = (documents: DocumentRead[]): FetchDocumentsSuccessAction => ({
  type: FETCH_DOCUMENTS_SUCCESS,
  documents,
});

export const fetchDocumentsError = (error: string): FetchDocumentsErrorAction => ({
  type: FETCH_DOCUMENTS_ERROR,
  error,
});

export const createDocument = (
  document: DocumentWrite,
  source: DocumentSource,
  bimObjectId: number
): CreateDocumentAction => ({
  type: CREATE_DOCUMENT,
  document,
  source,
  bimObjectId,
});

export const createDocumentSuccess = (): CreateDocumentSuccessAction => ({
  type: CREATE_DOCUMENT_SUCCESS,
});

export const createDocumentError = (error: Error): CreateDocumentErrorAction => ({
  type: CREATE_DOCUMENT_ERROR,
  error,
});

export const updateDocument = (
  document: DocumentRead,
  bimObjectId: number
): UpdateDocumentAction => ({
  type: UPDATE_DOCUMENT,
  document,
  bimObjectId,
});

export const updateDocumentSuccess = (): UpdateDocumentSuccessAction => ({
  type: UPDATE_DOCUMENT_SUCCESS,
});

export const updateDocumentError = (error: Error): UpdateDocumentErrorAction => ({
  type: UPDATE_DOCUMENT_ERROR,
  error,
});

export const deleteDocument = (
  document: DocumentRead,
  bimObjectId: number
): DeleteDocumentAction => ({
  type: DELETE_DOCUMENT,
  document,
  bimObjectId,
});

export const deleteDocumentSuccess = (): DeleteDocumentSuccessAction => ({
  type: DELETE_DOCUMENT_SUCCESS,
});

export const deleteDocumentError = (error: Error): DeleteDocumentErrorAction => ({
  type: DELETE_DOCUMENT_ERROR,
  error,
});