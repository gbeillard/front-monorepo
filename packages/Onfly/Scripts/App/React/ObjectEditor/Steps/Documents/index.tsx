import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  DocumentRead,
  Variant,
  DocumentWrite,
  DocumentSource,
} from '../../../../Reducers/BimObject/Documents/types';
import {
  fetchDocuments as fetchDocumentsAction,
  createDocument as createDocumentAction,
  updateDocument as updateDocumentAction,
  deleteDocument as deleteDocumentAction,
} from '../../../../Reducers/BimObject/Documents/actions';
import { fetchDocumentTypes as fetchDocumentTypesAction } from '../../../../Reducers/app/actions';
import { fetchVariants as fetchObjectVariantsAction } from '../../../../Reducers/BimObject/Variants/actions';
import {
  selectCommonDocuments,
  selectVariantsDocument,
  selectHasCompletedCreate,
  selectHasCompletedUpdate,
  selectHasCompletedDelete,
  selectHasCompletedfetchDocuments,
} from '../../../../Reducers/BimObject/Documents/selectors';
import { selectLanguageCode } from '../../../../Reducers/app/selectors';

import { fetchAllSubsets as fetchAllSubsetsAction } from '../../../../Reducers/Sets/Subsets/actions';

import Component from './Component';

type Props = {
  bimObjectId: number;
  fetchDocuments: (bimObjectId: number) => void;
  createDocument: (document: DocumentWrite, source: DocumentSource, bimObjectId: number) => void;
  updateDocument: (document: DocumentRead, bimObjectId: number) => void;
  deleteDocument: (document: DocumentRead, bimObjectId: number) => void;
  fetchDocumentTypes: () => void;
  fetchObjectVariants: (bimObjectId: number) => void;
  language: string;
  documents: DocumentRead[];
  variants: Variant[];
  hasCompletedCreate: boolean;
  hasCompletedUpdate: boolean;
  hasCompletedDelete: boolean;
  hasCompletedFetchDocuments: boolean;
  fetchAllSubsets: () => void;
};

const Index: React.FunctionComponent<Props> = ({
  bimObjectId,
  // mapStateToProps
  language,
  documents,
  variants,
  hasCompletedCreate,
  hasCompletedUpdate,
  hasCompletedDelete,
  hasCompletedFetchDocuments,
  // mapDispatchToProps
  fetchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  fetchDocumentTypes,
  fetchObjectVariants,
  fetchAllSubsets,
}) => {
  useEffect(() => {
    fetchDocumentTypes();
    fetchObjectVariants(bimObjectId);
    fetchDocuments(bimObjectId);
    fetchAllSubsets();
  }, [language]);

  const onCreateHandler = (document: DocumentWrite, source: DocumentSource) => {
    createDocument(document, source, bimObjectId);
  };

  const onEditHandler = (document: DocumentRead) => {
    updateDocument(document, bimObjectId);
  };

  const onDeleteHandler = (document: DocumentRead) => {
    deleteDocument(document, bimObjectId);
  };

  return (
    <Component
      documents={documents}
      variants={variants}
      onCreate={onCreateHandler}
      onEdit={onEditHandler}
      onDelete={onDeleteHandler}
      hasCompletedCreate={hasCompletedCreate}
      hasCompletedUpdate={hasCompletedUpdate}
      hasCompletedDelete={hasCompletedDelete}
      hasCompletedFetchDocuments={hasCompletedFetchDocuments}
    />
  );
};

const mapSelectToProps = createStructuredSelector({
  language: selectLanguageCode,
  documents: selectCommonDocuments,
  variants: selectVariantsDocument,
  hasCompletedCreate: selectHasCompletedCreate,
  hasCompletedUpdate: selectHasCompletedUpdate,
  hasCompletedDelete: selectHasCompletedDelete,
  hasCompletedFetchDocuments: selectHasCompletedfetchDocuments,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDocuments: (bimObjectId: number) => dispatch(fetchDocumentsAction(bimObjectId)),
  createDocument: (document: DocumentWrite, source: DocumentSource, bimObjectId: number) =>
    dispatch(createDocumentAction(document, source, bimObjectId)),
  updateDocument: (document: DocumentRead, bimObjectId: number) =>
    dispatch(updateDocumentAction(document, bimObjectId)),
  deleteDocument: (document: DocumentRead, bimObjectId: number) =>
    dispatch(deleteDocumentAction(document, bimObjectId)),
  fetchDocumentTypes: () => dispatch(fetchDocumentTypesAction()),
  fetchObjectVariants: (bimObjectId: number) => dispatch(fetchObjectVariantsAction(bimObjectId)),
  fetchAllSubsets: () => dispatch(fetchAllSubsetsAction()),
});

export default connect(mapSelectToProps, mapDispatchToProps)(Index);