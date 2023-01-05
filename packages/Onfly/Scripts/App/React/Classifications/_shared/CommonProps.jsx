import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { TextField } from '@material-ui/core';
import Languages from './Languages.jsx';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources.js';

const CommonProps = ({ classification, onClassificationChanged, resources }) => {
  const onNameChange = (event) => {
    onClassificationChanged({ ...classification, Name: event.target.value });
  };
  const onVersionChange = (event) => {
    onClassificationChanged({ ...classification, Version: event.target.value });
  };
  const onLanguageChange = (languageCode) => {
    onClassificationChanged({ ...classification, LanguageCode: languageCode });
  };
  const onDescriptionChange = (event) => {
    onClassificationChanged({ ...classification, Description: event.target.value });
  };

  return (
    <>
      <Wrapper>
        <TextField
          value={classification.Name}
          onChange={onNameChange}
          placeholder={resources.ContentManagement.ClassificationName}
          required
        />
        <TextField
          value={classification.Version}
          onChange={onVersionChange}
          placeholder={resources.ContentManagement.ClassificationVersion}
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
      />
    </>
  );
};

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
});

export default connect(mapSelectToTranslatedResources)(CommonProps);