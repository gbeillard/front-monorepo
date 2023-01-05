import React from 'react';
import { connect } from 'react-redux';
import DownloadButton from '../_shared/DownloadButton';
import ExcelDropzone from '../_shared/ExcelDropzone';
import Classification from './Classification';
import PropertyDisplay from '../_shared/PropertyDisplay';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources';

const Form = ({
  classification,
  setClassification,
  translations,
  onPickName,
  onPickCode,
  onDownload,
  resources,
  disableCriticalFeatures,
  role,
}) => {
  const onUploadHandler = (template) => {
    setClassification({ ...classification, Template: template });
  };

  const onDeleteNameHandler = () => {
    setClassification({ ...classification, PropertyName: null });
  };

  const onDeleteCodeHandler = () => {
    setClassification({ ...classification, PropertyCode: null });
  };

  const hasFile = classification.Template !== null;

  return (
    <>
      <Classification
        classification={classification}
        onClassificationChange={setClassification}
        translations={translations}
        hasFile={hasFile}
        disableCriticalFeatures={disableCriticalFeatures}
        role={role}
      />
      <PropertyDisplay
        text={resources.ContentManagement.ClassificationNamePicker}
        value={classification.PropertyName}
        onPick={onPickName}
        onDelete={onDeleteNameHandler}
        disableCriticalFeatures={disableCriticalFeatures}
      />
      <PropertyDisplay
        text={resources.ContentManagement.ClassificationCodePicker}
        value={classification.PropertyCode}
        onPick={onPickCode}
        onDelete={onDeleteCodeHandler}
        disableCriticalFeatures={disableCriticalFeatures}
      />
      <DownloadButton onDownload={onDownload} disableCriticalFeatures={disableCriticalFeatures} />
      <ExcelDropzone
        hasFile={hasFile}
        onFileUploaded={onUploadHandler}
        disableCriticalFeatures={disableCriticalFeatures}
      />
    </>
  );
};

export default connect(mapSelectToTranslatedResources)(Form);