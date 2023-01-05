/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import Dropzone from 'react-dropzone';
import { Button } from '@bim-co/componentui-foundation';

// material UI imports
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

import Dialog from '../../../components/dialogs/Dialog';
import DialogActions from '../../../components/dialogs/DialogActions';
import DialogContent from '../../../components/dialogs/DialogContent';
import DialogTitle from '../../../components/dialogs/DialogTitle';

// other imports
import PropertiesImportViewList from './PropertiesImportViewList.jsx';
import PropertyElementMUI from '../PropertyElementMUI.jsx';
import { getLanguageLabel } from '../../Header/LanguageOption';
import FileLoader from './FileLoader';

const MENU_PROPS = {
  disableEnforceFocus: true,
  disableAutoFocus: true,
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  style: {
    zIndex: 2100,
  },
};

export default function PropertiesImportTxt({
  resources,
  propertiesImportOpen,
  propertiesTxtClose,
  language,
  languages,
  temporaryToken,
  managementCloudId,
  domains,
  units,
  dataTypes,
  editTypes,
  currentTxtPreviewData,
  onCheckExcelImport,
  currentTxtFileName,
  parameterTypes,
  mapImportDatasEdit,
  editLineDatas,
  editLineName,
  propertyEditValid,
  languageTxtImport,
  uploadRevitParameterFile,
  changeLanguageTxtImport,
  uploadDataImport,
  isLoadingTemplate,
}) {
  const [showDragAndDrop, setshowDragAndDrop] = useState(true);
  const [showList, setshowList] = useState(false);
  const [showDetails, setshowDetails] = useState(false);

  const selectConfigurationLanguage = (event) => {
    const languageCode = event.target.value;
    if (languageTxtImport !== languageCode) {
      changeLanguageTxtImport(languageCode);
    }
  };

  const languagesList = languages.map((lang) => {
    if (!lang.IsInterface) {
      return null;
    }

    const languageTrad = getLanguageLabel(lang.Translations, lang.LanguageCode);

    return (
      <MenuItem
        key={`lang-${lang.LanguageCode}`}
        className="menu-item-language"
        value={lang.LanguageCode}
      >
        <ListItemIcon>
          <span className={`language-icon lang-${lang.LanguageCode}`} />
        </ListItemIcon>
        <ListItemText inset primary={languageTrad} className="lang-name manage-item" />
      </MenuItem>
    );
  });

  const actionCheckDataImport = (event) => {
    const currentExcelElement = event.currentTarget.id;
    onCheckExcelImport(currentExcelElement, false);
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

  const actionCheckAllImport = () => {
    onCheckExcelImport(-1, true);
  };

  const propertyEditValidAction = (datas) => {
    setshowList(true);
    setshowDetails(false);
    propertyEditValid(datas);
  };

  const onDropAction = (event) => {
    setshowList(true);
    setshowDragAndDrop(false);
    uploadRevitParameterFile(event);
  };

  const isPastFirstScreen = showList || showDetails;
  const size = showDetails ? 'large' : 'medium';

  return (
    <Dialog
      size={size}
      open={propertiesImportOpen}
      onClose={propertiesTxtClose}
      disableBackdropClick={isPastFirstScreen}
      disableEscapeKeyDown={isPastFirstScreen}
      fullWidth
      maxWidth="md"
    >
      {showDragAndDrop && (
        <>
          <DialogTitle disableTypography>
            {resources.ContentManagement.PropertiesImportParameterHeader}
          </DialogTitle>

          <DialogContent>
            <SelectWrapper id="mapping-configuration-language-container">
              <FormControl id="mapping-configuration-language">
                <Select
                  name="language"
                  value={languageTxtImport}
                  className="select-configuration-language"
                  onChange={selectConfigurationLanguage}
                  input={<Input id="input-select-configuration-language" disableUnderline />}
                  MenuProps={MENU_PROPS}
                >
                  {languagesList}
                </Select>
              </FormControl>
            </SelectWrapper>
            <DropzoneWrapper>
              <Dropzone
                multiple={false}
                accept=".txt"
                maxSize={31457280}
                className="dropzone-upload-file dropzone-area"
                onDropAccepted={onDropAction}
              >
                <Typography className="dropzone-title" variant="h6" gutterBottom>
                  {resources.ContentManagementDictionary.UploadSharedParametersFile}
                </Typography>
                <Typography className="dropzone-subtitle legende" variant="subtitle1" gutterBottom>
                  {resources.ContentManagementDictionary.SupportedSharedParametersFiles}
                </Typography>
                <LinearProgress className="dropzone-progress-bar hidden" />
              </Dropzone>
            </DropzoneWrapper>
          </DialogContent>

          <DialogActions>
            <Button onClick={propertiesTxtClose}>{resources.MetaResource.Cancel}</Button>
          </DialogActions>
        </>
      )}

      {showList && isLoadingTemplate && <FileLoader onCancel={closePropertiesImportViewList} />}
      {showList && !isLoadingTemplate && (
        <PropertiesImportViewList
          currentPreviewData={currentTxtPreviewData}
          resources={resources}
          closePropertiesImportViewList={closePropertiesImportViewList}
          language={language}
          domains={domains}
          units={units}
          dataTypes={dataTypes}
          openEditImportLine={openEditImportLine}
          actionCheckDataImport={actionCheckDataImport}
          currentFileName={currentTxtFileName}
          actionCheckAllImport={actionCheckAllImport}
          validateTemplateData={uploadDataImport}
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
          CancelButtonAction={closeEditImportLine}
          IsReadOnly={false}
          ValidButtonClass="modal-footer"
          IsRequestReplie={false}
          CancelButtonLabel={resources.MetaResource.Cancel}
          IsImportBcMode={false}
        />
      )}
    </Dialog>
  );
}

const SelectWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  margin: '64px auto',
});

const DropzoneWrapper = styled.div({
  marginBottom: '64px',
});