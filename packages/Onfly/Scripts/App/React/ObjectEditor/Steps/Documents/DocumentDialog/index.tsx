import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { Button, InfoModal } from '@bim-co/componentui-foundation';
import { Validation } from '../utils';
import ImportForm from './ImportForm';
import Navigation from './Navigation';
import { DocumentWrite, DocumentSource } from '../../../../../Reducers/BimObject/Documents/types';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  document: DocumentWrite;
  onDocumentChange: (x: DocumentWrite) => void;
  source: DocumentSource;
  setSource: (x: DocumentSource) => void;
  allowSourceChange?: boolean;
  onSubmit: () => void;
  validation: Validation;
  resources: any;
  loading?: boolean;
};

const DocumentDialog: React.FC<Props> = ({
  open,
  onClose,
  title,
  document,
  onDocumentChange,
  source,
  setSource,
  allowSourceChange = true,
  onSubmit,
  validation,
  resources,
  loading,
}) => {
  if (document === null) {
    return null;
  }

  return (
    <InfoModal.Component active={open} close={onClose} size="large">
      <InfoModal.Title>{title}</InfoModal.Title>
      <InfoModal.Content>
        <Navigation
          source={source}
          setSource={setSource}
          allowSourceChange={allowSourceChange}
          resources={resources}
        />
        <ImportForm
          document={document}
          onDocumentChange={onDocumentChange}
          source={source}
          validation={validation}
        />
      </InfoModal.Content>
      <MainActionsWrapper>
        <Button variant="alternative" onClick={onClose}>
          {resources.MetaResource.Cancel}
        </Button>
        <Button variant="primary" isLoading={loading} onClick={onSubmit}>
          {resources.MetaResource.Confirm}
        </Button>
      </MainActionsWrapper>
    </InfoModal.Component>
  );
};

const MainActionsWrapper = styled(InfoModal.MainActions)`
  justify-content: flex-end;
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(DocumentDialog);