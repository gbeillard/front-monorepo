/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DialogTitle, DialogContent, DialogActions, CircularProgress } from '@material-ui/core';
import { Button } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import API from '../../../Api/ClassificationsApi';
import {
  selectToken,
  selectManagementCloudId,
  selectLanguageCode,
  selectTranslatedResources,
  selectRole,
} from '../../../Reducers/app/selectors';
import { getTranslation } from './utils';
import PropertyPicker from '../../Properties/PropertyPicker';
import Form from './Form.jsx';
import { EDITED_PROP } from './constants';
import { fetchNodes as fetchNodesAction } from '../../../Reducers/classifications/actions';

const getInitialClassification = (data, languageCode) => {
  const { ClassificationId, Version, PropertyName, PropertyCode, IsMandatory } = data;
  const { ClassificationName, ClassificationDescription, ClassificationLangCode } = getTranslation(
    data.ClassificationDetails,
    languageCode
  );

  return {
    ClassificationId,
    Name: ClassificationName,
    Version,
    Description: ClassificationDescription,
    LanguageCode: ClassificationLangCode,
    Template: null,
    PropertyName,
    PropertyCode,
    IsMandatory,
  };
};

const EditClassification = ({
  classificationId,
  onClose,
  editedProp,
  setEditedProp,
  onSuccess,
  disableCriticalFeatures, // from parent
  token,
  managementCloudId,
  languageCode,
  resources,
  role, // mapStateToProps
  fetchNodes, // mapDispatchToProps
}) => {
  const [classification, setClassification] = useState(null);
  const [translations, setTranslations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const id = parseInt(classificationId, 10);
    fetchData(id);
  }, []);

  const fetchData = async (id) => {
    const data = await API.fetchClassification(token, managementCloudId, id, languageCode);
    const mappedClassification = getInitialClassification(data, languageCode);
    setTranslations(data.ClassificationDetails);
    setClassification({ ...mappedClassification, Template: null });
  };

  const onDownloadHandler = () => {
    API.getExcelClassification(managementCloudId, classification.LanguageCode, classificationId);
  };

  const onPickNameHandler = () => {
    setEditedProp(EDITED_PROP.NAME);
  };

  const onPickCodeHandler = () => {
    setEditedProp(EDITED_PROP.CODE);
  };

  const onPropertyClickedHandler = (property) => {
    if (editedProp === EDITED_PROP.NAME) {
      setClassification({ ...classification, PropertyName: property });
      setEditedProp(EDITED_PROP.NONE);
      return;
    }
    setClassification({ ...classification, PropertyCode: property });
    setEditedProp(EDITED_PROP.NONE);
  };

  const onCancelHandler = () => {
    if (editedProp === EDITED_PROP.NONE) {
      onClose();
      return;
    }

    setEditedProp(EDITED_PROP.NONE);
  };

  const onSaveHandler = async () => {
    setIsLoading(true);
    const id = await API.saveClassification(token, managementCloudId, classification);
    await API.updateMandatory(
      token,
      managementCloudId,
      classification.ClassificationId,
      classification.IsMandatory
    );

    await fetchData(id);
    fetchNodes(id);
    setIsLoading(false);
    onClose();
    onSuccess && onSuccess();
  };

  if (classification === null) {
    return null;
  }

  let dialogContent;

  if (isLoading) {
    dialogContent = (
      <CircularProgressWrapper>
        <CircularProgress />
      </CircularProgressWrapper>
    );
  } else if (editedProp !== EDITED_PROP.NONE) {
    dialogContent = <PropertyPicker onPropertyClicked={onPropertyClickedHandler} />;
  } else {
    dialogContent = (
      <Form
        classification={classification}
        setClassification={setClassification}
        translations={translations}
        onDownload={onDownloadHandler}
        onPickName={onPickNameHandler}
        onPickCode={onPickCodeHandler}
        disableCriticalFeatures={disableCriticalFeatures}
        role={role}
      />
    );
  }

  return (
    <>
      <DialogTitle>{resources.ContentManagement.EditClassification}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onCancelHandler}>
          {resources.MetaResource.Cancel}
        </Button>
        {editedProp === EDITED_PROP.NONE && !isLoading && (
          <Button variant="primary" onClick={onSaveHandler}>
            {resources.MetaResource.Save}
          </Button>
        )}
      </DialogActions>
    </>
  );
};

const CircularProgressWrapper = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  marginTop: '100px',
  marginBottom: '100px',
});

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  managementCloudId: selectManagementCloudId,
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
  role: selectRole,
});
const mapDispatchToProps = (dispatch) => ({
  fetchNodes: (classificationId) => dispatch(fetchNodesAction(classificationId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditClassification);