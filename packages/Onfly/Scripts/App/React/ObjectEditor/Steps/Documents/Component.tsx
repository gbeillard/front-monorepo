import React, { useState, useEffect, ReactNode } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { H2, H3, Button } from '@bim-co/componentui-foundation';
import Grid from '@material-ui/core/Grid';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import {
  DocumentRead,
  Variant,
  DocumentWrite,
  DocumentSource,
} from '../../../../Reducers/BimObject/Documents/types';
// Design system component
import COLORS from '../../../../components/colors';
import Link from '../../../../components/text/Link';
// Material-UI component
// Child component
import DocumentTable from './DocumentTable';
import VariantTable from './VariantTable';
import DeleteModal from '../../../CommonsElements/DeleteModal';
import DocumentDialog from './DocumentDialog';
import { Validation, getCreateValidation, getEditValidation } from './utils';
import { replaceStringByComponent } from '../../../../Utils/utilsResources';

const Background = styled.div({
  backgroundColor: COLORS.EMPTY,
  padding: '22px 25px',
  borderRadius: '8px',
  minHeight: '150px',
  marginBottom: '15px',
});

const EmptyStateContainer = styled.div({
  textAlign: 'center',
  marginTop: '24px',
});

type Props = {
  resources: any;
  documents: DocumentRead[];
  variants: Variant[];
  onCreate: (x: DocumentWrite, y: DocumentSource) => void;
  onEdit: (x: DocumentRead) => void;
  onDelete: (x: DocumentRead) => void;
  hasCompletedCreate: boolean;
  hasCompletedUpdate: boolean;
  hasCompletedDelete: boolean;
  hasCompletedFetchDocuments: boolean;
};

const DEFAULT_DOCUMENT: DocumentWrite = {
  Name: '',
  Variants: [],
  FileName: '',
  Subsets: [],
};

const DEFAULT_VALIDATION: Validation = {
  name: true,
  file: true,
  link: true,
  isReady: true,
};

const Component: React.FunctionComponent<Props> = ({
  resources,
  documents,
  variants,
  hasCompletedCreate,
  hasCompletedUpdate,
  hasCompletedDelete,
  hasCompletedFetchDocuments,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [documentToCreate, setDocumentToCreate] = useState<DocumentWrite | null>(null);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [source, setSource] = useState(DocumentSource.File);
  const [validation, setValidation] = useState<Validation>(DEFAULT_VALIDATION);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasCompletedCreate) {
      setDocumentToCreate(null);
      setLoading(false);
    }
  }, [hasCompletedCreate]);

  useEffect(() => {
    if (hasCompletedUpdate) {
      setDocumentToEdit(null);
      setLoading(false);
    }
  }, [hasCompletedUpdate]);

  useEffect(() => {
    if (hasCompletedDelete) {
      setDocumentToDelete(null);
    }
  }, [hasCompletedDelete]);

  const onShowDocumentCreateHandler = () => {
    setDocumentToCreate(DEFAULT_DOCUMENT);
  };
  const onShowAddDocumentToReferenceHandler = (variant: Variant) => {
    const document: DocumentWrite = { ...DEFAULT_DOCUMENT, Variants: [variant] };
    setDocumentToCreate(document);
  };
  const onCloseDocumentCreateHandler = () => {
    setDocumentToCreate(null);
    setLoading(false);
  };
  const onCreateHandler = () => {
    const updatedValidation = getCreateValidation(documentToCreate, source);
    setValidation(updatedValidation);
    if (updatedValidation.isReady) {
      setLoading(true);
      onCreate(documentToCreate, source);
      setValidation(DEFAULT_VALIDATION);
    }
  };
  const onChangeDocumentCreateHandler = (document: DocumentWrite) => {
    if (!validation.isReady) {
      const updatedValidation = getCreateValidation(document, source);
      setValidation(updatedValidation);
    }
    setDocumentToCreate(document);
  };

  const onShowDocumentEditHandler = (document: DocumentRead) => {
    setDocumentToEdit(document);
    const updatedSource = document.IsInternal ? DocumentSource.File : DocumentSource.Link;
    setSource(updatedSource);
  };
  const onCloseDocumentEditHandler = () => {
    setDocumentToEdit(null);
    setLoading(false);
  };
  const onEditHandler = () => {
    const updatedValidation = getEditValidation(documentToEdit as DocumentWrite, source);
    setValidation(updatedValidation);
    if (updatedValidation.isReady) {
      setLoading(true);
      onEdit(documentToEdit as DocumentRead);
      setValidation(DEFAULT_VALIDATION);
    }
  };
  const onChangeDocumentEditHandler = (document: DocumentWrite) => {
    if (!validation.isReady) {
      const updatedValidation = getEditValidation(document, source);
      setValidation(updatedValidation);
    }
    setDocumentToEdit(document);
  };

  const onShowDocumentDeleteHandler = (document: DocumentRead) => {
    setDocumentToDelete(document);
  };
  const onCloseDocumentDeleteHandler = () => {
    setDocumentToDelete(null);
  };
  const onDeleteHandler = () => {
    onDelete(documentToDelete as DocumentRead);
  };

  let referencesTitle = resources.EditDocumentsPage.ReferencesTitle;

  if (
    referencesTitle !== null &&
    referencesTitle !== undefined &&
    variants !== null &&
    variants !== undefined
  ) {
    referencesTitle = referencesTitle.replace('[NbReferences]', variants.length);
  }

  const editDialogTitle = resources.DocumentsDialog.TitleEdit.replace(
    '[DocumentName]',
    documentToEdit ? documentToEdit.Name : ''
  );

  let emptyStateTitle: string | ReactNode = resources.EditDocumentsPage.EmptyState;
  if (emptyStateTitle) {
    const addDocumentLink = (
      <Link onClick={onShowDocumentCreateHandler}>{resources.EditDocumentsPage.AddDocument}</Link>
    );
    emptyStateTitle = replaceStringByComponent(
      emptyStateTitle as string,
      '[ButtonAddDocument]',
      addDocumentLink
    );
  }

  return (
    <Background>
      <Grid container direction="row" justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item>
          <H2>{resources.EditDocumentsPage.BlockTitle}</H2>
        </Grid>
        <Grid item>
          <Button variant="primary" onClick={onShowDocumentCreateHandler}>
            {resources.EditDocumentsPage.AddDocument}
          </Button>
        </Grid>
      </Grid>
      {hasCompletedFetchDocuments &&
        documents &&
        documents.length === 0 &&
        variants &&
        variants.length === 0 && <EmptyStateContainer>{emptyStateTitle}</EmptyStateContainer>}
      {documents !== null && documents !== undefined && documents.length > 0 && (
        <H3>{resources.EditDocumentsPage.DocumentsCommonAllReferencesTitle}</H3>
      )}
      <DocumentTable
        documents={documents}
        onClickEdit={onShowDocumentEditHandler}
        onClickDelete={onShowDocumentDeleteHandler}
      />
      {variants !== null && variants !== undefined && variants.length > 0 && (
        <H3>{referencesTitle}</H3>
      )}
      <VariantTable
        variants={variants}
        onClickEdit={onShowDocumentEditHandler}
        onClickDelete={onShowDocumentDeleteHandler}
        onClickAddDocumentToReference={onShowAddDocumentToReferenceHandler}
      />
      <DeleteModal
        open={documentToDelete != null}
        title={resources.DeleteDocumentModal.ModalTitle}
        content={resources.DeleteDocumentModal.ModalText}
        close={resources.DeleteDocumentModal.CancelBtn}
        confirm={resources.DeleteDocumentModal.ConfirmBtn}
        onClose={onCloseDocumentDeleteHandler}
        onConfirm={onDeleteHandler}
      />
      <DocumentDialog
        open={documentToCreate !== null}
        title={resources.DocumentsDialog.Title}
        onClose={onCloseDocumentCreateHandler}
        source={source}
        setSource={setSource}
        document={documentToCreate}
        onDocumentChange={onChangeDocumentCreateHandler}
        onSubmit={onCreateHandler}
        validation={validation}
        loading={loading}
      />
      <DocumentDialog
        open={documentToEdit !== null}
        onClose={onCloseDocumentEditHandler}
        title={editDialogTitle}
        source={source}
        setSource={setSource}
        allowSourceChange={false}
        document={documentToEdit}
        onDocumentChange={onChangeDocumentEditHandler}
        onSubmit={onEditHandler}
        validation={validation}
        loading={loading}
      />
    </Background>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});
export default connect(mapSelectToProps)(Component);