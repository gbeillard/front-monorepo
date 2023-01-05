/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import Dropzone from 'react-dropzone';
import { Button } from '@bim-co/componentui-foundation';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import Dialog from '../../../components/dialogs/Dialog';
import DialogTitle from '../../../components/dialogs/DialogTitle';
import DialogContent from '../../../components/dialogs/DialogContent';
import DialogActions from '../../../components/dialogs/DialogActions';
import PropertiesImportViewList from './PropertiesImportViewList.jsx';
import PropertyElementMUI from '../PropertyElementMUI.jsx';
import FileLoader from './FileLoader';

export default function PropertiesImportExcel({
  resources,
  propertiesImportOpen,
  propertiesExcelClose,
  language,
  languages,
  temporaryToken,
  managementCloudId,
  domains,
  units,
  dataTypes,
  editTypes,
  uploadExcelTemplate,
  currentExcelPreviewData,
  onCheckExcelImport,
  downloadExcelTemplate,
  currentExcelFileName,
  parameterTypes,
  mapImportDatasEdit,
  editLineDatas,
  editLineName,
  propertyEditValid,
  uploadDataImport,
  isLoadingTemplate,
}) {
  const [showDragAndDrop, setshowDragAndDrop] = useState(true);
  const [showList, setshowList] = useState(false);
  const [showDetails, setshowDetails] = useState(false);

  const uploadExcelTemplateAction = (file) => {
    if (file !== null) {
      uploadExcelTemplate(file);
      setshowDragAndDrop(false);
      setshowList(true);
    }
  };

  const closePropertiesImportViewList = () => {
    setshowDragAndDrop(true);
    setshowList(false);
  };

  const openEditImportLine = (event) => {
    mapImportDatasEdit(event);
    setshowList(false);
    setshowDetails(true);
  };

  const closeEditImportLine = () => {
    setshowDetails(false);
    setshowList(true);
  };

  const propertyEditValidAction = (datas) => {
    setshowList(true);
    setshowDetails(false);
    propertyEditValid(datas);
  };

  const actionCheckAllImport = () => {
    onCheckExcelImport(-1, true);
  };

  const actionCheckDataImport = (event) => {
    const currentExcelElement = event.currentTarget.id;
    onCheckExcelImport(currentExcelElement, false);
  };

  const isPastFirstScreen = showList || showDetails;
  const size = showDetails ? 'large' : 'medium';

  return (
    <ImportDialog
      open={propertiesImportOpen}
      onClose={propertiesExcelClose}
      size={size}
      disableBackdropClick={isPastFirstScreen}
      disableEscapeKeyDown={isPastFirstScreen}
      fullWidth
      maxWidth="md"
    >
      {showDragAndDrop && (
        <>
          <DialogTitle>{resources.ContentManagement.PropertiesImportExcelHeader}</DialogTitle>

          <DialogContent>
            <ButtonWrapper>
              <Button variant="secondary" onClick={downloadExcelTemplate}>
                {resources.ContentManagement.PropertiesExcelTemplateDownload}
              </Button>
            </ButtonWrapper>

            <DropzoneWrapper>
              <Dropzone
                multiple={false}
                accept=".xlsx"
                maxSize={31457280}
                className="dropzone-upload-file dropzone-area"
                onDropAccepted={uploadExcelTemplateAction}
              >
                <Typography className="dropzone-title" variant="h6" gutterBottom>
                  {resources.ContentManagement.PropertiesExcelTemplateUpload}
                </Typography>
                <Typography className="dropzone-subtitle legende" variant="subtitle1" gutterBottom>
                  {`${resources.MetaResource.SupportedFileTypes} .xlsx`}
                </Typography>
                <LinearProgress className="dropzone-progress-bar hidden" />
              </Dropzone>
            </DropzoneWrapper>
          </DialogContent>

          <DialogActions>
            <Button onClick={propertiesExcelClose}>{resources.MetaResource.Cancel}</Button>
          </DialogActions>
        </>
      )}

      {showList && isLoadingTemplate && <FileLoader onCancel={closePropertiesImportViewList} />}
      {showList && !isLoadingTemplate && (
        <PropertiesImportViewList
          currentPreviewData={currentExcelPreviewData}
          resources={resources}
          closePropertiesImportViewList={closePropertiesImportViewList}
          language={language}
          domains={domains}
          units={units}
          dataTypes={dataTypes}
          openEditImportLine={openEditImportLine}
          actionCheckDataImport={actionCheckDataImport}
          currentFileName={currentExcelFileName}
          actionCheckAllImport={actionCheckAllImport}
          validateTemplateData={uploadDataImport}
          showChecks={false}
        />
      )}

      {showDetails && (
        <PropertyElementMUI
          TemporaryToken={temporaryToken}
          ManagementCloudId={managementCloudId}
          Resources={resources}
          Language={language}
          Languages={languages}
          Domains={domains}
          Units={units}
          DataTypes={dataTypes}
          EditTypes={editTypes}
          ParameterTypes={parameterTypes}
          CurrentDataModel={editLineDatas}
          ValidateBottomButton={propertyEditValidAction}
          HeaderTitle={editLineName}
          HasHeaderReturnButton
          HeaderReturnButtonAction={closeEditImportLine}
          CancelButtonAction={closeEditImportLine}
          IsReadOnly={false}
          ValidButtonClass="modal-footer"
          IsRequestReplie={false}
          CancelButtonLabel={resources.MetaResource.Cancel}
          IsImportBcMode={false}
        />
      )}
    </ImportDialog>
  );
}

// #region styled
const ImportDialog = styled(Dialog)({
  zIndex: '2000 !important',
});
const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  margin: '80px auto',
});

const DropzoneWrapper = styled.div({
  marginBottom: '64px',
});
// #endregion