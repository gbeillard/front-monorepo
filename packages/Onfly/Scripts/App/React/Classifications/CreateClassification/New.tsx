import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import CommonProps from '../_shared/CommonProps';
import ExcelDropzone from '../_shared/ExcelDropzone';
import DownloadButton from '../_shared/DownloadButton';
import PropertyDisplay from '../_shared/PropertyDisplay';
import PropertyPicker from '../../Properties/PropertyPicker';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources';

type NewProps = {
  classification: any;
  onClassificationChanged: (c: any) => void;
  hasFile: boolean;
  onFileUploaded: () => void;
  onDownload: () => void;
  resources: any;
};

enum Properties {
  None,
  Name,
  Code,
}

const getUpdatedClassification = (classification, property, pickedProperty) => {
  if (property === Properties.Name) {
    return { ...classification, PropertyName: pickedProperty };
  }

  return { ...classification, PropertyCode: pickedProperty };
};

const New: React.FunctionComponent<NewProps> = ({
  classification,
  onClassificationChanged,
  hasFile,
  onFileUploaded,
  onDownload,
  resources,
}) => {
  const [property, setProperty] = useState(Properties.None);
  const onPickName = () => {
    setProperty(Properties.Name);
  };
  const onPickCode = () => {
    setProperty(Properties.Code);
  };
  const onDeleteNameHandler = () => {
    onClassificationChanged({ ...classification, PropertyName: null });
  };
  const onDeleteCodeHandler = () => {
    onClassificationChanged({ ...classification, PropertyCode: null });
  };
  const onPropertyPickedHandler = (pickedProperty) => {
    const updatedClassification = getUpdatedClassification(
      classification,
      property,
      pickedProperty
    );
    onClassificationChanged(updatedClassification);
    setProperty(Properties.None);
  };
  const closePropertyPicker = () => {
    setProperty(Properties.None);
  };

  return (
    <>
      <CommonProps
        classification={classification}
        onClassificationChanged={onClassificationChanged}
      />
      <PropertyDisplay
        text={resources.ContentManagement.ClassificationNamePicker}
        value={classification.PropertyName}
        onPick={onPickName}
        onDelete={onDeleteNameHandler}
      />
      <PropertyDisplay
        text={resources.ContentManagement.ClassificationCodePicker}
        value={classification.PropertyCode}
        onPick={onPickCode}
        onDelete={onDeleteCodeHandler}
      />
      <DownloadButton onDownload={onDownload} />
      <ExcelDropzone hasFile={hasFile} onFileUploaded={onFileUploaded} />
      <Dialog
        open={property !== Properties.None}
        onClose={closePropertyPicker}
        fullWidth
        maxWidth="md"
      >
        <PropertyPicker onPropertyClicked={onPropertyPickedHandler} />
      </Dialog>
    </>
  );
};
export default connect(mapSelectToTranslatedResources)(New);