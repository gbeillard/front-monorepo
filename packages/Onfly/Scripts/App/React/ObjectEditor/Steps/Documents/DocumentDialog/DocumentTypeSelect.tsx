import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { Label, Select, space, defaultTheme } from '@bim-co/componentui-foundation';
import { fetchDocumentTypes } from '../../../../../Reducers/app/actions';
import {
  selectDocumentTypes,
  selectTranslatedResources,
  selectLanguageCode,
} from '../../../../../Reducers/app/selectors';
import { DocumentType, DocumentTypeDetails } from '../../../../../Reducers/BimObject/Documents/types';
import { LanguageCode } from '../../../../../Reducers/app/types';

const getLabel = (type: DocumentTypeDetails, languageCode: LanguageCode) =>
  type.BimObjectDocumentTypeLangList.find((lang) => lang.LanguageCode === languageCode)?.Name;

const getOptions = (types: DocumentTypeDetails[], languageCode: LanguageCode): Option[] =>
  types.map((type) => ({ value: type.Id, label: getLabel(type, languageCode) }));

type Props = {
  value: DocumentType;
  onChange: (x: DocumentType) => void;
  types: DocumentTypeDetails[];
  fetchTypes: () => void;
  languageCode: LanguageCode;
  resources: any;
};

type Option = {
  value: number;
  label: string;
};

export const DocumentTypeSelect: React.FC<Props> = ({
  value,
  onChange,
  types,
  fetchTypes,
  languageCode,
  resources,
}) => {
  useEffect(() => {
    if (!types || types.length === 0) {
      fetchTypes();
    }
  }, []);

  const onChangeHandler = (option: Option) => {
    const selectedType = types.find((type) => type.Id === option.value);
    onChange(selectedType);
  };

  const options = getOptions(types, languageCode);
  const selectedValue = options.find((option) => option.value === value?.Id);

  return (
    <DocumentTypeSelectContainer>
      <StyledLabel>{resources.DocumentsDialog.LabelDocumentType}</StyledLabel>
      <Select
        placeholder={resources.DocumentsDialog.PlaceholderDocumentType}
        value={selectedValue}
        onChange={onChangeHandler}
        options={options}
      />
    </DocumentTypeSelectContainer>
  );
};

const DocumentTypeSelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
`;

const StyledLabel = styled(Label)`
  margin-bottom: ${space[50]};
  font-weight: ${defaultTheme.boldWeight};
`;

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  types: selectDocumentTypes,
  resources: selectTranslatedResources,
});
const mapDispatchToProps = (dispatch) => ({
  fetchTypes: () => dispatch(fetchDocumentTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentTypeSelect);