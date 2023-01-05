import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Label, FilePicker, TextField, space, defaultTheme } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import {
  DocumentWrite,
  DocumentType,
  DocumentSubsets,
  DocumentSource,
} from '../../../../../Reducers/BimObject/Documents/types';
import { ObjectVariant } from '../../../../../Reducers/BimObject/Variants/types';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import DocumentTypeSelect from './DocumentTypeSelect';
import LanguageSelect from './LanguageSelect';
import { LanguageCode } from '../../../../../Reducers/app/types';
import VariantsMultiSelect from './VariantsMultiSelect';
import SubsetsMultiSelect from './SubsetsMultiSelect';

import { Validation } from '../utils';

type Props = {
  document: DocumentWrite;
  onDocumentChange: (x: DocumentWrite) => void;
  validation: Validation;
  source: DocumentSource;
  resources: any;
};

const getFileName = (file: File) => {
  if (!file) {
    return '';
  }

  return file.name;
};

const ImportForm: React.FC<Props> = ({
  document,
  onDocumentChange,
  source,
  validation,
  resources,
}) => {
  const [shouldPreserveName, setShouldPreserveName] = useState(false);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const File = event.target.files[0];
    if (shouldPreserveName) {
      onDocumentChange({ ...document, File });
      return;
    }

    const Name = getFileName(File);
    onDocumentChange({ ...document, File, Name });
  };

  const onLinkChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onDocumentChange({ ...document, FileName: event.target.value });
  };

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onDocumentChange({ ...document, Name: event.target.value });
    setShouldPreserveName(true);
  };

  const onTypeChange = (type: DocumentType) => {
    onDocumentChange({ ...document, Type: type });
  };

  const onLanguageChange = (languageCode: LanguageCode) => {
    onDocumentChange({ ...document, LanguageCode: languageCode });
  };

  const onVariantsChange = (variants: ObjectVariant[]) => {
    onDocumentChange({ ...document, Variants: variants });
  };

  const onSubsetsChange = (subsets: DocumentSubsets[]) => {
    onDocumentChange({ ...document, Subsets: subsets });
  };

  const isFileError = validation.file === false;
  const isLinkError = validation.link === false;
  const isNameError = validation.name === false;
  const fileError = isFileError ? resources.MetaResource.Required : undefined;
  const linkError = isLinkError ? resources.MetaResource.Required : undefined;
  const nameError = isNameError ? resources.MetaResource.Required : undefined;

  return (
    <Container>
      <Row>
        <RowLeft>
          {source === DocumentSource.File && (
            <FilePicker
              label={resources.DocumentsDialog.LabelFile}
              onChange={onFileChange}
              isError={isFileError}
              helperText={fileError}
            />
          )}
          {source === DocumentSource.Link && (
            <TextField
              label={resources.DocumentsDialog.LabelURL}
              placeholder={resources.DocumentsDialog.PlaceholderURL}
              value={document.FileName}
              onChange={onLinkChange}
              isError={isLinkError}
              helperText={linkError}
            />
          )}
        </RowLeft>
        <RowRight>
          <StyledLabel>{resources.DocumentsDialog.LabelLanguage}</StyledLabel>
          <LanguageSelect
            placeholder={resources.DocumentsDialog.PlaceholderLanguage}
            value={document.LanguageCode}
            onChange={onLanguageChange}
            hasMultilingualOption
          />
        </RowRight>
      </Row>

      <StyledTextField
        label={resources.DocumentsDialog.LabelName}
        placeholder={resources.DocumentsDialog.PlaceholderName}
        value={document.Name}
        onChange={onNameChange}
        isError={isNameError}
        helperText={nameError}
      />

      <DocumentTypeSelect value={document.Type} onChange={onTypeChange} />

      <VariantsMultiSelect values={document.Variants} onChange={onVariantsChange} />

      <SubsetsMultiSelect values={document.Subsets} onChange={onSubsetsChange} />
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

const Container = styled.div({
  width: '100%',
});
const Row = styled.div({
  width: '100%',
  display: 'flex',
  flexFlow: 'row nowrap',
});

const RowLeft = styled.div`
  width: 60%;
`;

const RowRight = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 40%;
  margin-left: ${space[200]};
`;

const StyledTextField = styled(TextField)`
  margin-top: ${space[100]};
`;

const StyledLabel = styled(Label)`
  margin-top: 0;
  margin-bottom: ${space[50]};
  font-weight: ${defaultTheme.boldWeight};
`;

export default connect(mapStateToProps)(ImportForm);