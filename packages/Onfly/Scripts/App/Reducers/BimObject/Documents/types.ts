import { Set } from '../../properties-sets/types';
import { LanguageCode } from '../../app/types';
import { ObjectVariant } from '../Variants/types';

export const FETCH_DOCUMENTS = 'BIMOBJECT/DOCUMENTS/FETCH_DOCUMENTS';
export const FETCH_DOCUMENTS_SUCCESS = 'BIMOBJECT/DOCUMENTS/FETCH_DOCUMENTS_SUCCESS';
export const FETCH_DOCUMENTS_ERROR = 'BIMOBJECT/DOCUMENTS/FETCH_DOCUMENTS_ERROR';

export const CREATE_DOCUMENT = 'BIMOBJECT/DOCUMENTS/CREATE_DOCUMENT';
export const CREATE_DOCUMENT_SUCCESS = 'BIMOBJECT/DOCUMENTS/CREATE_DOCUMENT_SUCCESS';
export const CREATE_DOCUMENT_ERROR = 'BIMOBJECT/DOCUMENTS/CREATE_DOCUMENT_ERROR';

export const UPDATE_DOCUMENT = 'BIMOBJECT/DOCUMENTS/UPDATE_DOCUMENT';
export const UPDATE_DOCUMENT_SUCCESS = 'BIMOBJECT/DOCUMENTS/UPDATE_DOCUMENT_SUCCESS';
export const UPDATE_DOCUMENT_ERROR = 'BIMOBJECT/DOCUMENTS/UPDATE_DOCUMENT_ERROR';

export const DELETE_DOCUMENT = 'BIMOBJECT/DOCUMENTS/DELETE_DOCUMENT';
export const DELETE_DOCUMENT_SUCCESS = 'BIMOBJECT/DOCUMENTS/DELETE_DOCUMENT_SUCCESS';
export const DELETE_DOCUMENT_ERROR = 'BIMOBJECT/DOCUMENTS/DELETE_DOCUMENT_ERROR';

export type DocumentType = {
  Id: number;
  Key: string;
};

export type DocumentSubsets = {
  Id: number;
  Name: string;
  Set?: Set;
  IsDefault: boolean;
};

export type DocumentTypeDetails = DocumentType & {
  TypeName: string;
  BimObjectDocumentTypeLangList: DocumentTypeTranslation[];
};

export type DocumentTypeTranslation = {
  Id: number;
  LanguageCode: string;
  Name: string;
};

export type DocumentWrite = {
  Id?: number;
  Name: string;
  LanguageCode?: LanguageCode;
  Type?: DocumentType;
  Variants: ObjectVariant[];
  Subsets: DocumentSubsets[];

  FileName: string;
  File?: File;
};

export type DocumentRead = DocumentWrite & {
  Id: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  IsInternal: boolean;

  AbsolutePath?: string;
  Extension: string;
};

export type Variant = ObjectVariant & {
  Documents: DocumentRead[];
};

export enum DocumentSource {
  File,
  Link,
}

export type FetchDocumentsAction = {
  type: typeof FETCH_DOCUMENTS;
  bimObjectId: number;
};

export type FetchDocumentsSuccessAction = {
  type: typeof FETCH_DOCUMENTS_SUCCESS;
  documents: DocumentRead[];
};

export type FetchDocumentsErrorAction = {
  type: typeof FETCH_DOCUMENTS_ERROR;
  error: string;
};

export type CreateDocumentAction = {
  type: typeof CREATE_DOCUMENT;
  bimObjectId: number;
  document: DocumentWrite;
  source: DocumentSource;
};

export type CreateDocumentSuccessAction = {
  type: typeof CREATE_DOCUMENT_SUCCESS;
};

export type CreateDocumentErrorAction = {
  type: typeof CREATE_DOCUMENT_ERROR;
  error: Error;
};

export type UpdateDocumentAction = {
  type: typeof UPDATE_DOCUMENT;
  bimObjectId: number;
  document: DocumentRead;
};

export type UpdateDocumentSuccessAction = {
  type: typeof UPDATE_DOCUMENT_SUCCESS;
};

export type UpdateDocumentErrorAction = {
  type: typeof UPDATE_DOCUMENT_ERROR;
  error: Error;
};

export type DeleteDocumentAction = {
  type: typeof DELETE_DOCUMENT;
  document: DocumentRead;
  bimObjectId: number;
};

export type DeleteDocumentSuccessAction = {
  type: typeof DELETE_DOCUMENT_SUCCESS;
};

export type DeleteDocumentErrorAction = {
  type: typeof DELETE_DOCUMENT_ERROR;
  error: Error;
};

export type DocumentsActions =
  | FetchDocumentsAction
  | FetchDocumentsSuccessAction
  | FetchDocumentsErrorAction
  | CreateDocumentAction
  | CreateDocumentSuccessAction
  | CreateDocumentErrorAction
  | UpdateDocumentAction
  | UpdateDocumentSuccessAction
  | UpdateDocumentErrorAction
  | DeleteDocumentAction
  | DeleteDocumentSuccessAction
  | DeleteDocumentErrorAction;