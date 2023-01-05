import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import New from './New';
import Copy from './Copy';
import Navbar from './Navbar';
import { CREATE_CLASSIFICATION_STEPS } from '../Home/constants';
import {
  selectTranslatedResources,
  selectLanguageCode,
  selectLanguages,
} from '../../../Reducers/app/selectors';

const Wrapper = styled.div({
  minWidth: '530px',
});

const DEFAULT_LANGUAGE_CODE = 'en';
const getInitialLanguageCode = (languageCode) => languageCode || DEFAULT_LANGUAGE_CODE;

const Content = ({ step, ...otherProps }) =>
  step === CREATE_CLASSIFICATION_STEPS.NEW ? <New {...otherProps} /> : <Copy {...otherProps} />;

const shouldDisableCreate = ({ Name: name, CopyFrom: copyFrom }, step) => {
  if (step === CREATE_CLASSIFICATION_STEPS.NEW) {
    return name.length < 1;
  }

  return name.length < 1 || !copyFrom;
};
const CreateClassification = ({
  languageCode,
  languages,
  resources, // mapStateToProps
  onCreate,
  onClone,
  onDownload,
  onClose, // from parent
}) => {
  const [classification, setClassification] = useState({
    Name: '',
    LanguageCode: getInitialLanguageCode(languageCode, languages),
    Version: '',
    Description: '',
    Template: null,
    CopyFrom: undefined,
  });
  const [step, setStep] = useState(CREATE_CLASSIFICATION_STEPS.NEW);

  const onFileUploadedHandler = (template) => {
    setClassification({ ...classification, Template: template });
  };
  const onClickHandler = () => {
    if (step === CREATE_CLASSIFICATION_STEPS.NEW) {
      onCreate(classification);
      return;
    }

    onClone(classification);
  };
  const handleDownload = () => {
    onDownload(classification.LanguageCode);
  };

  const hasFile = classification.Template !== null;
  const isDisableCreate = shouldDisableCreate(classification, step);
  return (
    <Wrapper>
      <DialogTitle>{resources.ContentManagement.CreateNewClassification}</DialogTitle>
      <DialogContent>
        <Navbar step={step} onStepChange={setStep} />
        <Content
          classification={classification}
          onClassificationChanged={setClassification}
          onDownload={handleDownload}
          step={step}
          hasFile={hasFile}
          onFileUploaded={onFileUploadedHandler}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{resources.MetaResource.Cancel}</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isDisableCreate}
          data-cy={`dialog-${resources.ContentManagement.CreateNewClassification}`}
          onClick={onClickHandler}
        >
          {resources.ContentManagement.CreateNewClassification}
        </Button>
      </DialogActions>
    </Wrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  languages: selectLanguages,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(CreateClassification);