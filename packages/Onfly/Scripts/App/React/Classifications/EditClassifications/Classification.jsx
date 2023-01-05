/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import { getTranslation } from './utils';
import Languages from '../_shared/Languages';
import { RoleKey } from '../../../Reducers/Roles/types';
import { selectLanguage } from '../../../Reducers/classifications/selectors';
import { selectTranslatedResources, selectLanguageCode } from '../../../Reducers/app/selectors';

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
});

const getUpdatedClassification = (classification, translations, languageCode) => {
  const { ClassificationName, ClassificationDescription } = getTranslation(
    translations,
    languageCode
  );

  return {
    ...classification,
    Name: ClassificationName,
    Description: ClassificationDescription,
    LanguageCode: languageCode,
  };
};

const Classification = ({
  classification,
  onClassificationChange,
  disableCriticalFeatures,
  role,
  translations,
  languages = [], // from parent
  resources,
  languageCodeClassification, // mapStateToProps
}) => {
  useEffect(() => {
    onClassificationChange(
      getUpdatedClassification(classification, translations, languageCodeClassification)
    );
  }, []);

  const onNameChange = (event) => {
    onClassificationChange({ ...classification, Name: event.target.value });
  };
  const onVersionChange = (event) => {
    onClassificationChange({ ...classification, Version: event.target.value });
  };
  const onDescriptionChange = (event) => {
    onClassificationChange({ ...classification, Description: event.target.value });
  };
  const onMandatoryChange = (event) => {
    const IsMandatory = event.target.checked;
    onClassificationChange({ ...classification, IsMandatory });
  };

  const onLanguageChange = (languageCode) => {
    const updatedClassification = getUpdatedClassification(
      classification,
      translations,
      languageCode
    );
    onClassificationChange(updatedClassification);
  };

  return (
    <>
      <Wrapper>
        <TextField
          value={classification.Name}
          onChange={onNameChange}
          placeholder={resources.ContentManagement.ClassificationName}
          disabled={disableCriticalFeatures}
        />
        <TextField
          value={classification.Version}
          onChange={onVersionChange}
          placeholder={resources.ContentManagement.ClassificationVersion}
          disabled={disableCriticalFeatures}
        />
        <Languages selectedLanguageCode={classification.LanguageCode} onChange={onLanguageChange} />
      </Wrapper>
      <TextField
        value={classification.Description}
        onChange={onDescriptionChange}
        placeholder={resources.ContentManagement.ClassificationDescription}
        multiline
        fullWidth
        rowsMax="2"
        disabled={disableCriticalFeatures}
      />
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={classification.IsMandatory}
            onChange={onMandatoryChange}
            disabled={role.key !== RoleKey.admin}
          />
        }
        label={resources.ContentManagementClassif.ClassificationMandatory}
      />
    </>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCodeClassification: selectLanguage,
  languageCode: selectLanguageCode,
});

export default connect(mapSelectToProps)(Classification);