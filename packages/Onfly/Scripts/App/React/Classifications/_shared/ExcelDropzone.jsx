import React from 'react';
import Dropzone from 'react-dropzone';
import styled from '@emotion/styled';
import DropzoneContent from './DropzoneContent.jsx';

const ExcelDropzone = ({ hasFile, onFileUploaded, disableCriticalFeatures = false }) => {
  const onDrop = (acceptedFiles) => {
    if (hasFile) {
      return;
    }
    const file = acceptedFiles[0];
    onFileUploaded(file);
  };

  return (
    <Dropzone
      style={{}}
      multiple={false}
      accept=".xlsx"
      maxSize={31457280}
      onDropAccepted={onDrop}
      disabled={disableCriticalFeatures}
    >
      {({ getRootProps, isDragActive }) => (
        <Wrapper {...getRootProps} isDragActive={isDragActive} hasFile={hasFile}>
          <DropzoneContent hasFile={hasFile} />
        </Wrapper>
      )}
    </Dropzone>
  );
};

const getWrapperBorder = (hasFile, isDragActive) => {
  if (hasFile) {
    return 'none';
  }

  if (isDragActive) {
    return '2px solid grey';
  }

  return '2px dotted grey';
};
const getBackgroundColor = (hasFile, isDragActive) => {
  if (hasFile) {
    return '#3fa7507d';
  }

  if (isDragActive) {
    return '#d3d3d3';
  }

  return '#d3d3d366';
};
const getHeight = (hasFile) => (hasFile ? '0px' : '150px');

const getCalculatedStyles = (hasFile, isDragActive) => {
  const border = getWrapperBorder(hasFile, isDragActive);
  const backgroundColor = getBackgroundColor(hasFile, isDragActive);
  const height = getHeight(hasFile);
  return {
    border,
    backgroundColor,
    height,
  };
};
const Wrapper = styled.div(({ isDragActive, hasFile }) => ({
  width: '100%',
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
  transition: 'height .5s ease-in 2s, background-color .5s ease-in',
  overflow: 'hidden',
  ...getCalculatedStyles(hasFile, isDragActive),
}));

export default ExcelDropzone;