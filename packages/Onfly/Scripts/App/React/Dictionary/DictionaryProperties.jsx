/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable brace-style */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import toastr from 'toastr';

// material ui
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import { Input } from '@bim-co/componentui-foundation';

// material ui icons
import CancelIcon from '@material-ui/icons/Cancel.js';
import DeleteIcon from '@material-ui/icons/Delete.js';
import AddIcon from '@material-ui/icons/Add.js';

// other elements
import SplitButton from '../CommonsElements/SplitButton.jsx';
import PropertiesImportExcel from '../CommonsElements/PropertiesImport/PropertiesImportExcel.jsx';
import PropertiesImportTxt from '../CommonsElements/PropertiesImport/PropertiesImportTxt.jsx';
import PropertyEdition from '../CommonsElements/PropertyEdition.jsx';
import { API_URL } from '../../Api/constants';
import store from '../../Store/Store';
import DeleteModal from '../CommonsElements/DeleteModal';
import PropertiesModal from './PropertiesModal';
import { setLoader as setLoaderAction } from '../../Reducers/app/actions';
import iconSearch from '../../../../Content/images/icon-search.svg';
import API from '../../Reducers/dictionary/api';

import {
  selectVisibleProperties,
  selectFilter,
  selectProperties,
  selectAddOfficialPropertiesSuccess,
  selectDuplicatePropertySuccess,
} from '../../Reducers/dictionary/selectors';
import {
  setFilter,
  increaseVisibleCount,
  fetchDictionary,
  duplicateProperty,
  selectAllProperties,
  setSortBy,
  setSortOrder,
  selectProperty,
  addOfficialProperties,
} from '../../Reducers/dictionary/actions';
import {
  selectToken,
  selectTranslatedResources,
  selectManagementCloudId,
  selectLanguageCode,
  selectLanguages,
} from '../../Reducers/app/selectors.js';

let DictionaryProperties = createReactClass({
  getInitialState() {
    return {
      currentSplitButton: 0,
      splitButtonOpen: false,
      isSpace: this.props.PlanType === 3,
      propertiesSearch: '',
      currentSortName: 'sortDomain',
      currentSortOrder: 'asc',
      languageCodeImport: this.props.Language,
      isDeleteModalOpen: false,
      isExcelModalOpen: false,
      isPropertiesParametersOpen: false,
      ispropertyEditionOpen: false,
      currentPropertyToDelete: [],
      uploadType: '',
      selectedProperty: null,
      isPropertyInCreationMode: false,
      propertyPanelTitle: '',
      propertyPanelValidAction: null,
      uploadedExcelTemplate: null,
      showPropertiesModal: false,
      currentImportFileName: '',
      currentPreviewData: null,
      languageTxtImport: this.props.Language,
      editLineDatas: [],
      editLineName: '',
      openModalDuplicateProperty: false,
      propertyToDuplicate: null,
      isLoadingTemplate: false,
    };
  },

  componentDidMount() {
    this.props.fetchDictionary();
    this.props.setSortBy(this.state.currentSortName);
    this.props.setSortOrder(this.state.currentSortOrder);

    if (this.props.Settings.EnableDictionary) {
      window.addEventListener('scroll', this.scrollAction);

      store.dispatch({
        type: 'LOAD_PROPERTY',
        language: this.props.Language,
        temporaryToken: this.props.TemporaryToken,
      });
    }
  },

  componentDidUpdate(prevProps) {
    if (prevProps.duplicatePropertySuccess !== this.props.duplicatePropertySuccess) {
      if (
        this.state.ispropertyEditionOpen === true ||
        this.state.openModalDuplicateProperty === true ||
        this.state.propertyToDuplicate !== null
      ) {
        this.setState({
          ispropertyEditionOpen: false,
          openModalDuplicateProperty: false,
          propertyToDuplicate: null,
        });
      }
    }
    if (prevProps === this.props && this.state.isDeleteModalOpen !== true) {
      this.props.fetchDictionary();
    }
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollAction);
  },

  scrollAction(event) {
    if (($(window).scrollTop() + $(window).height()) / $(document).height() > 0.8) {
      event.stopPropagation();
      this.props.increaseVisibleCount();
    }
  },

  // #region CRUD_property
  createProperty(propertyElements) {
    const self = this;
    const currentElements = propertyElements;
    this.props.setLoader(true);
    fetch(
      `${API_URL}/api/ws/v1/${self.props.Language}/contentmanagement/${self.props.ManagementCloudId}/dictionary/property/create?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LanguageCode: currentElements.PropertyLang,
          Name: currentElements.PropertyName,
          Description: currentElements.PropertyDescription,
          DomainId: currentElements.PropertyDomain,
          DomainType: currentElements.PropertyDomainType,
          Unit: currentElements.PropertyUnit,
          EditType: currentElements.PropertyEditType,
          EditTypeValues: currentElements.PropertyEditTypeValues,
          Information: currentElements.PropertyInformations,
          DataType: currentElements.PropertyType,
          ToOfficial: false,
          ManagementCloudId: self.props.ManagementCloudId,
          Nature: currentElements.Nature,
          ParameterType: currentElements.PropertyParameterType,
        }),
      }
    ).then((response) => {
      self.props.setLoader(false);
      if (response.status === 200) {
        toastr.success(self.props.Resources.ContentManagement.PropertiesCreationConfirmation);
        self.props.selectAllProperties(false);
        self.props.fetchDictionary();
        self.setState({
          ispropertyEditionOpen: false,
          selectedProperty: null,
        });
      } else {
        toastr.error(response.statusText);
      }
    });
  },

  loadPropertyDetails(propertyId) {
    const self = this;
    let isResponseOk = true;
    self.props.setLoader(true);

    fetch(
      `${API_URL}/api/ws/v1/${self.props.Language}/contentmanagement/${self.props.ManagementCloudId}/dictionary/property/${propertyId}/details?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        self.props.setLoader(false);
        if (response.status === 200) {
          return response.json();
        }

        isResponseOk = false;
        toastr.error(response.statusText);
      })
      .then((json) => {
        if (isResponseOk) {
          self.setState({
            propertyPanelValidAction: self.validateEditProperty,
            selectedProperty: json,
            isPropertyInCreationMode: false,
            ispropertyEditionOpen: true,
            propertyPanelTitle: self.props.Resources.ContentManagement.PropertiesEditTitle,
          });
        }
      });
  },

  updateProperty(propertyElements) {
    const currentData = propertyElements;
    const self = this;
    let hasErrorMessage = false;

    self.props.setLoader(true);

    const updatedDatas = JSON.stringify(currentData);

    fetch(
      `${API_URL}/api/ws/v1/${self.props.Language}/contentmanagement/${self.props.ManagementCloudId}/dictionary/property/${currentData.PropertyId}/update?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: updatedDatas,
      }
    )
      .then((response) => {
        self.props.setLoader(false);
        if (response.status === 200) {
          $('.prop-dictionary-panel').removeClass('selected');
          $('.bg-prop-dictionary-panel').removeClass('selected');
          $('body').removeClass('panel-selected');
          toastr.success(self.props.Resources.ContentManagement.PropertyUpdated);
          self.props.fetchDictionary();
          self.props.selectAllProperties(false);
          self.setState({
            ispropertyEditionOpen: false,
            selectedProperty: null,
          });
        } else {
          hasErrorMessage = true;
          return response.json();
        }
      })
      .then((object) => {
        if (hasErrorMessage) {
          toastr.error(object);
        }
      });
  },

  deleteProperty() {
    const self = this;
    // is delete line or delete list? =>
    const currentProperty =
      self.state.currentPropertyToDelete.length === 1
        ? self.state.currentPropertyToDelete
        : self.props.allCurrentProperties.filter((p) => p.selected === true).map((obj) => obj.Id);

    if (currentProperty != null && currentProperty !== '' && currentProperty !== []) {
      self.props.setLoader(true);

      fetch(
        `${API_URL}/api/ws/v1/${self.props.Language}/contentmanagement/${self.props.ManagementCloudId}/dictionary/property/delete?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PropertiesIdsToDelete: currentProperty,
          }),
        }
      ).then(() => {
        self.props.selectAllProperties(false);
        self.props.fetchDictionary();

        self.props.setLoader(false);
        self.setState({
          currentPropertyToDelete: [],
          isDeleteModalOpen: false,
        });
      });
    }
  },
  // #endregion

  // #region upload_files
  downloadExcelTemplate(event) {
    const self = this;
    event.stopPropagation();

    API.getExcelTemplateDictionary(self.props.Language, self.props.ManagementCloudId);
  },

  uploadExcelTemplate(file) {
    const self = this;
    if (file != null) {
      this.setState({ isLoadingTemplate: true });
      let isOk = true;
      const token = localStorage.getItem('Temporary_token');

      API.setExcelDictionary(self.props.Language, self.props.ManagementCloudId, file, token)
        .then((response) => {
          self.setState({ isLoadingTemplate: false });
          if (response.status === 200) {
            return response.json();
          }
          isOk = false;
          return response.json();
        })
        .then((json) => {
          if (isOk) {
            self.setState({
              currentPreviewData: json.Lines,
              currentImportFileName: json.CurrentFileName,
              uploadType: 'excel',
              currentFile: file,
            });
          } else {
            toastr.error(json.Message);
          }
        });
    }
  },

  uploadRevitParameterFile(file) {
    const self = this;

    if (file != null) {
      this.setState({ isLoadingTemplate: true });

      const data = new FormData();
      data.append('file', file[0]);
      let isOk = true;

      fetch(
        `${API_URL}/api/ws/v1/${self.props.Language}/contentmanagement/${self.props.ManagementCloudId}/dictionary/properties/revitupload/${self.state.languageCodeImport}/read?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          body: data,
        }
      )
        .then((response) => {
          this.setState({ isLoadingTemplate: false });
          if (response.status === 200) {
            return response.json();
          }

          isOk = false;
          toastr.error(response.statusText);
        })
        .then((json) => {
          if (isOk) {
            self.setState({
              currentPreviewData: json.PropertiesTemplateModelList,
              currentImportFileName: json.CurrentFileName,
              currentFile: file,
              numberLineImportError: 0,
              uploadType: 'txt',
            });
          }
        });
    }
  },

  uploadDataImport() {
    const self = this;
    self.props.setLoader(true);

    const datasToTransmit = [];
    self.state.currentPreviewData.forEach((data) => {
      if (data.PropertyIsChecked) {
        datasToTransmit.push(data);
      }
    });

    const currentDatas = JSON.stringify({
      CurrentFileName: self.state.currentImportFileName,
      Lines: datasToTransmit,
      LanguageCodeImport: self.state.languageCodeImport,
    });

    const data = new FormData();
    data.append(
      'file',
      self.state.currentFile != null && self.state.currentFile.length > 0
        ? self.state.currentFile[0]
        : null
    );
    data.append('currentDatas', currentDatas);

    if (datasToTransmit.length > 0) {
      const token = localStorage.getItem('Temporary_token');
      const type = `${self.state.uploadType}upload`;

      let isOk = true;

      API.validateImportExcelDictionary(
        self.props.Language,
        self.props.ManagementCloudId,
        type,
        data,
        token
      )
        .then((response) => {
          if (response.status !== 200) {
            isOk = false;
            return response.json();
          }
          return response;
        })
        .then((json) => {
          self.props.setLoader(false);
          if (isOk === true) {
            self.setState({
              propertiesImportOpen: false,
              isExcelModalOpen: false,
              isPropertiesParametersOpen: false,
            });
            self.props.fetchDictionary();
            self.props.selectAllProperties(false);
          } else if (json !== undefined && json !== null && json !== '') {
            toastr.error(json);
          } else {
            toastr.error(self.props.Resources.ContentManagement.FileNotSupported);
          }
        });
    }
  },
  // #endregion

  validateEditProperty(propertyElements) {
    this.dispatchPropertyValidity(propertyElements, true);
  },

  validateNewProperty(propertyElements) {
    this.dispatchPropertyValidity(propertyElements, false);
  },

  dispatchPropertyValidity(currentProp, isEdition = false) {
    if (isEdition === true) {
      this.updateProperty(currentProp);
    } else {
      this.createProperty(currentProp);
    }
  },

  onCheckDataImport(idCheck, checkAll) {
    const self = this;
    const currentData = self.state.currentPreviewData;

    // check all click
    if (idCheck === -1 && checkAll === true) {
      // if not all are selected =>
      const total = currentData.length;
      const checked = currentData.filter((id) => id.PropertyIsChecked === true).length;
      const nameOrGuidExist = currentData.filter(
        (id) => id.IsNameExists === true || id.IsGuidExists
      ).length;
      if (checked + nameOrGuidExist !== total) {
        for (const d in currentData) {
          if (currentData[d].isNameExists || currentData[d].IsGuidExists) {
            currentData[d].PropertyIsChecked = false;
          } else {
            currentData[d].PropertyIsChecked = true;
          }
        }
        this.setState({ currentPreviewData: currentData });
      }
      // else, unselect all =>
      else {
        for (const d in currentData) {
          currentData[d].PropertyIsChecked = false;
        }
        this.setState({ currentPreviewData: currentData });
      }
    }
    // line click
    else {
      const elementIndex = currentData.findIndex((id) => id.PropertyLineId === idCheck);
      currentData[elementIndex].PropertyIsChecked = !currentData[elementIndex].PropertyIsChecked;
      this.setState({ currentPreviewData: currentData });
    }
  },

  handleChangeSearchInput(event) {
    const self = this;
    const request = event.target.value;
    self.state.propertiesSearch = request;

    setTimeout(() => {
      if (self.state.propertiesSearch === request) {
        self.props.setFilter(request);
      }
    }, 500);
  },

  showDeleteIcon(event) {
    const currentLine = event.currentTarget.id;
    const currentIcon = document.getElementById(`property-line-delete-icon-${currentLine}`);
    currentIcon.classList.remove('hidden');
  },

  hideDeleteIcon(event) {
    const currentLine = event.currentTarget.id;
    const currentIcon = document.getElementById(`property-line-delete-icon-${currentLine}`);
    currentIcon.classList.add('hidden');
  },

  openConfirmDeleteProperty(id) {
    this.setState({
      currentPropertyToDelete: [id],
      isDeleteModalOpen: true,
    });
  },

  handleSortproperties(currentColumn) {
    const self = this;
    if (currentColumn !== '') {
      // sort by order =>
      if (currentColumn === self.state.currentSortName) {
        const newOrder = this.state.currentSortOrder === 'desc' ? 'asc' : 'desc';
        self.state.currentSortOrder = newOrder;
        self.props.setSortBy(self.state.currentSortName);
        self.props.setSortOrder(self.state.currentSortOrder);
      }
      // sort by name =>
      else {
        self.state.currentSortName = currentColumn;
        self.props.setSortBy(self.state.currentSortName);
        self.props.setSortOrder(self.state.currentSortOrder);
      }
    }
  },

  openPropertiesModal() {
    this.setState({
      showPropertiesModal: true,
      currentPreviewData: [],
    });
  },

  closePropertiesModal() {
    this.setState({ showPropertiesModal: false });
  },

  addSelectedProperties(properties) {
    this.props.addOfficialProperties(properties);
    store.dispatch({
      type: 'LOAD_PROPERTY',
      language: this.props.Language,
      temporaryToken: this.props.TemporaryToken,
    });
    this.props.fetchDictionary();
    this.closePropertiesModal();
  },

  importExcelAction() {
    this.setState({
      isExcelModalOpen: true,
      currentPreviewData: [],
    });
  },
  abortActionExcel() {
    this.setState({ isExcelModalOpen: false });
  },

  importTxtAction() {
    this.setState({
      isPropertiesParametersOpen: true,
      currentPreviewData: [],
    });
  },

  ExportExcelAction() {
    const self = this;

    API.getExcelDictionary(self.props.Language, self.props.ManagementCloudId);
  },

  abortActionTxt() {
    this.setState({ isPropertiesParametersOpen: false });
  },

  deleteList() {
    this.setState({ isDeleteModalOpen: true });
  },

  closeDeleteModalAction() {
    this.setState({
      currentPropertyToDelete: [],
      isDeleteModalOpen: false,
    });
  },

  selectPropertyLine(event) {
    const currentId = parseInt(event.currentTarget.value, 10);
    this.props.selectProperty(currentId);
  },

  selectAllProperty() {
    const self = this;
    // if not all are selected =>
    if (
      self.props.allCurrentProperties.filter((p) => p.selected === true).length !==
      self.props.allCurrentProperties.length
    ) {
      self.props.selectAllProperties(true);
    }
    // else, unselect all =>
    else {
      self.props.selectAllProperties(false);
    }
  },

  unselectAllProperties() {
    this.props.selectAllProperties(false);
  },

  openCreationProperty() {
    this.setState({
      propertyPanelValidAction: this.validateNewProperty,
      selectedProperty: null,
      ispropertyEditionOpen: true,
      propertyPanelTitle: this.props.Resources.UserPropertyPage.TitleCreatePropertyLabel,
      isPropertyInCreationMode: true,
    });
  },

  propertyEditionClose() {
    this.setState({ ispropertyEditionOpen: false });
  },

  mapImportDatasEdit(id) {
    const self = this;
    // set datas =>
    const { currentPreviewData } = self.state;
    const currentLineDetailsIndex = currentPreviewData.findIndex(
      (prop) => prop.PropertyLineId === id
    );
    const currentLineDetails = currentPreviewData[currentLineDetailsIndex];
    const currentLineDetailsLangIndex = currentLineDetails.PropertyLangs.findIndex(
      (lang) => lang.LangCode.toLowerCase() === self.props.Language.toLowerCase()
    );
    const currentLineDetailsLang =
      currentPreviewData[currentLineDetailsIndex].PropertyLangs[currentLineDetailsLangIndex];

    const currentLangs = [];
    currentLineDetails.PropertyLangs.forEach((lang) => {
      const currentLang = {
        IsDefaultTranslation: lang.IsDefaultLang,
        PropertyDescription: lang.LangDescription,
        PropertyEditTypeValues: lang.LangSelectionValue,
        PropertyInformations: lang.LangUserInformation,
        PropertyName: lang.LangName,
        TranslationLangCode: lang.LangCode,
        LangPropertyGuid: lang.LangPropertyGuid,
      };
      currentLangs.push(currentLang);
    });

    const currentData = {
      PropertyDataTypeCode: currentLineDetails.PropertyDataType,
      PropertyDomainCode: currentLineDetails.PropertyDomainCode,
      PropertyEditTypeCode: currentLineDetails.PropertyEditType,
      PropertyId: id,
      PropertyUnitCode: currentLineDetails.PropertyUnitCode,
      Translations: currentLangs,
      PropertyParameterType: currentLineDetails.ParameterTypeId,
      IsAuthorisedToEdit: true,
    };
    self.setState({
      editLineDatas: currentData,
      editLineName: currentLineDetailsLang.LangName,
    });
  },

  propertyEditValid(data) {
    const self = this;
    const dataToUpdate = data;
    const currentData = this.state.currentPreviewData;
    const currentUpdateIndex = currentData.findIndex(
      (id) => id.PropertyLineId.toString() === dataToUpdate.PropertyId.toString()
    );

    if (currentUpdateIndex > -1) {
      const currentUpdate = currentData[currentUpdateIndex];
      currentUpdate.propertyDataType = data.PropertyDataTypeCode;
      currentUpdate.propertyDomainCode = data.PropertyDomainCode;
      currentUpdate.propertyEditType = data.PropertyEditTypeCode;
      currentUpdate.propertyUnitCode = data.PropertyUnitCode;
      currentUpdate.PropertyParameterType = data.PropertyParameterType;

      // we are here after namecheck (so we are sure than there is no other existing name) =>
      currentUpdate.IsNameExists = false;
      // and there is no missing element =>
      currentUpdate.IsOk = true;

      // then, update langs datas =>
      const updatedLangs = [];
      data.Translations.forEach((lang) => {
        const updatedLang = {
          langCode: lang.TranslationLangCode,
          langDescription: lang.PropertyDescription,
          langName: lang.PropertyName,
          langSelectionValue: lang.PropertyEditTypeValues,
          langUserInformation: lang.PropertyInformations,
          isDefaultLang: lang.IsDefaultTranslation,
          langPropertyGuid: lang.LangPropertyGuid,
        };
        updatedLangs.push(updatedLang);
      });
      currentUpdate.propertyLangs = updatedLangs;
      self.setState({ currentPreviewData: currentData });
    }
  },

  changeLanguageTxtImport(lang) {
    this.setState({ languageTxtImport: lang });
  },

  handleOpenModalDuplicateProperty(propertyToDuplicate) {
    this.setState({
      openModalDuplicateProperty: true,
      propertyToDuplicate,
    });
  },

  closeModalDuplicateProperty() {
    this.setState({
      openModalDuplicateProperty: false,
      propertyToDuplicate: null,
    });
  },

  handleDuplicateClick() {
    this.props.duplicateProperty(this.state.propertyToDuplicate);
  },

  /* eslint-disable max-lines-per-function */
  render() {
    const self = this;
    const underBandClass =
      self.props.allCurrentProperties.filter((p) => p.selected === true).length > 0
        ? ' mui-fixed'
        : 'hidden mui-fixed';

    const currentProperties = self.props.properties.map((prop) => {
      const currentDomainName = prop.DomainName;

      let currentEditTypeName = '';
      let currentDataTypeName = '';
      let currentUnitSymbol = '';

      const currentEditType = self.props.EditTypes.find(
        (editType) => editType.Id === prop.EditTypeId
      );
      if (currentEditType !== undefined) {
        currentEditTypeName = currentEditType.Name.split('-')[1].toString();
      }

      const currentDataType = self.props.DataTypes.find(
        (dataType) => dataType.Id === prop.DataTypeId
      );

      if (currentDataType !== undefined) {
        currentDataTypeName = currentDataType.Name.split('-')[1].toString();
      }

      const isSelected =
        prop.selected !== null && prop.selected !== undefined && prop.selected === true;

      const currentUnitIndex = self.props.Units.findIndex((a) => a.Id === prop.UnitId);
      if (currentUnitIndex > -1) {
        currentUnitSymbol = self.props.Units[currentUnitIndex].Symbole;
      }

      return (
        <TableRow
          key={`table-line-${prop.Id}`}
          id={prop.Id}
          onMouseOver={self.showDeleteIcon}
          onMouseLeave={self.hideDeleteIcon}
        >
          <TableCell data-propertyid={prop.Id}>
            <Checkbox
              checked={isSelected}
              onChange={self.selectPropertyLine}
              value={prop.Id}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </TableCell>

          <TableCell
            className="domain-table-column-body"
            data-propertyid={prop.Id}
            onClick={() => self.loadPropertyDetails(prop.Id)}
          >
            {prop.Name}
          </TableCell>
          <TableCell
            className="domain-table-column-body"
            data-propertyid={prop.Id}
            onClick={() => self.loadPropertyDetails(prop.Id)}
          >
            {currentDomainName}
          </TableCell>
          <TableCell
            className="domain-table-column-body"
            data-propertyid={prop.Id}
            onClick={() => self.loadPropertyDetails(prop.Id)}
          >
            {currentUnitSymbol}
          </TableCell>
          <TableCell
            className="domain-table-column-body"
            data-propertyid={prop.Id}
            onClick={() => self.loadPropertyDetails(prop.Id)}
          >
            {currentEditTypeName}
          </TableCell>
          <TableCell
            className="domain-table-column-body"
            data-propertyid={prop.Id}
            onClick={() => self.loadPropertyDetails(prop.Id)}
          >
            {currentDataTypeName}
          </TableCell>
          <TableCell className="domain-table-column-body text-right" id={prop.Id}>
            <DeleteIcon
              id={`property-line-delete-icon-${prop.Id}`}
              className="property-line-delete hidden"
              onClick={() => self.openConfirmDeleteProperty(prop.Id)}
            />
          </TableCell>
        </TableRow>
      );
    });

    if (!self.props.Settings.EnableDictionary) {
      return (
        <div className="text-center">
          <h1 className="loadingtext">BIM&CO - ONFLY</h1>
          <p>{self.props.Resources.ContentManagement.Error403}</p>
        </div>
      );
    }

    return (
      <div>
        <div id="dictionary-properties" className="properties-container">
          <div id="page-elements">
            <div id="header-dico-elements">
              <Input
                placeholder={self.props.Resources.ContentManagement.PropertiesSearchPlaceholder}
                onChange={self.handleChangeSearchInput}
                iconLeft={iconSearch}
              />
              {!self.state.isSpace && (
                <SplitButton
                  SplitElements={[
                    {
                      name: this.props.Resources.ContentManagement.PropertiesEnhance,
                      action: this.openPropertiesModal,
                    },
                    {
                      name: this.props.Resources.ContentManagement.PropertiesImportExcel,
                      action: this.importExcelAction,
                    },
                    {
                      name: this.props.Resources.ContentManagement.PropertiesImportParameter,
                      action: this.importTxtAction,
                    },
                    {
                      name: this.props.Resources.ContentManagement.PropertiesExportParameter,
                      action: this.ExportExcelAction,
                    },
                  ]}
                  ActionOnClick
                />
              )}
            </div>

            <div id="content-dico-properties">
              <div id="content-dico-elements">
                {!self.state.isSpace && (
                  <Fab id="button-property-panel" onClick={self.openCreationProperty}>
                    <AddIcon />
                  </Fab>
                )}
                <div id="search-dico-elements-new">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="domain-table-column-head" id="checkAll">
                          <Checkbox
                            checked={
                              self.props.allCurrentProperties.filter((p) => p.selected === true)
                                .length === self.props.allCurrentProperties.length
                            }
                            onChange={self.selectAllProperty}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                        </TableCell>

                        <TableCell
                          className="domain-table-column-head"
                          id="sortName"
                          sortDirection={
                            self.state.currentSortName === 'sortName'
                              ? self.state.currentSortOrder
                              : false
                          }
                        >
                          <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                            <TableSortLabel
                              active={self.state.currentSortName === 'sortName'}
                              direction={self.state.currentSortOrder}
                              id="sortName"
                              onClick={() => self.handleSortproperties('sortName')}
                            >
                              {self.props.Resources.ContentManagement.PropertiesTitleName}
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>

                        <TableCell
                          className="domain-table-column-head"
                          id="sortDomain"
                          sortDirection={
                            self.state.currentSortName === 'sortDomain'
                              ? self.state.currentSortOrder
                              : false
                          }
                        >
                          <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                            <TableSortLabel
                              active={self.state.currentSortName === 'sortDomain'}
                              direction={self.state.currentSortOrder}
                              id="sortDomain"
                              onClick={() => self.handleSortproperties('sortDomain')}
                            >
                              {self.props.Resources.BimObjectDetails.PropertiesTableDomainLabel}
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>

                        <TableCell
                          className="domain-table-column-head"
                          id="sortUnit"
                          sortDirection={
                            self.state.currentSortName === 'sortUnit'
                              ? self.state.currentSortOrder
                              : false
                          }
                        >
                          <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                            <TableSortLabel
                              active={self.state.currentSortName === 'sortUnit'}
                              direction={self.state.currentSortOrder}
                              id="sortUnit"
                              onClick={() => self.handleSortproperties('sortUnit')}
                            >
                              {self.props.Resources.ContentManagement.PropertiesTitleUnitName}
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>

                        <TableCell
                          className="domain-table-column-head"
                          id="sortEditType"
                          sortDirection={
                            self.state.currentSortName === 'sortEditType'
                              ? self.state.currentSortOrder
                              : false
                          }
                        >
                          <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                            <TableSortLabel
                              active={self.state.currentSortName === 'sortEditType'}
                              direction={self.state.currentSortOrder}
                              id="sortEditType"
                              onClick={() => self.handleSortproperties('sortEditType')}
                            >
                              {self.props.Resources.ContentManagement.PropertiesTitleEditType}
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>

                        <TableCell
                          className="domain-table-column-head"
                          id="sortDataType"
                          sortDirection={
                            self.state.currentSortName === 'sortDataType'
                              ? self.state.currentSortOrder
                              : false
                          }
                        >
                          <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                            <TableSortLabel
                              active={self.state.currentSortName === 'sortDataType'}
                              direction={self.state.currentSortOrder}
                              id="sortDataType"
                              onClick={() => self.handleSortproperties('sortDataType')}
                            >
                              {self.props.Resources.ContentManagement.PropertiesTitleDataType}
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>

                        <TableCell className="domain-table-column-head text-right" />
                      </TableRow>
                    </TableHead>
                    <TableBody id="dico-properties-body">{currentProperties}</TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="underBandSelection" className={underBandClass}>
          <div className="underBandSelection-padding">
            <span>
              {`${self.props.allCurrentProperties.filter((p) => p.selected === true).length} ${self.props.Resources.ContentManagement.PropertiesSelected}`}
            </span>
            <IconButton onClick={self.unselectAllProperties}>
              <CancelIcon />
            </IconButton>
          </div>
          <ul>
            <li key="deleteBtn">
              <Button onClick={self.deleteList}>
                <DeleteIcon />
                {self.props.Resources.MetaResource.Delete}
              </Button>
            </li>
          </ul>
        </div>

        <DeleteModal
          open={self.state.isDeleteModalOpen}
          title={self.props.Resources.ContentManagement.SuppressionModalHeader}
          content={self.props.Resources.ContentManagement.SuppressionModalBody}
          close={self.props.Resources.MetaResource.Cancel}
          confirm={self.props.Resources.MetaResource.Delete}
          onClose={self.closeDeleteModalAction}
          onConfirm={self.deleteProperty}
        />

        <PropertiesImportExcel
          resources={self.props.Resources}
          temporaryToken={self.props.TemporaryToken}
          managementCloudId={self.props.ManagementCloudId}
          downloadExcelTemplate={self.downloadExcelTemplate}
          propertiesImportOpen={self.state.isExcelModalOpen}
          propertiesExcelClose={self.abortActionExcel}
          language={self.props.Language}
          languages={self.props.Languages}
          domains={self.props.Domains}
          units={self.props.Units}
          dataTypes={self.props.DataTypes}
          editTypes={self.props.EditTypes}
          parameterTypes={self.props.ParameterTypes}
          uploadExcelTemplate={self.uploadExcelTemplate}
          currentExcelFileName={self.state.currentImportFileName}
          currentExcelPreviewData={self.state.currentPreviewData}
          onCheckExcelImport={self.onCheckDataImport}
          mapImportDatasEdit={self.mapImportDatasEdit}
          editLineDatas={self.state.editLineDatas}
          editLineName={self.state.editLineName}
          propertyEditValid={self.propertyEditValid}
          uploadDataImport={self.uploadDataImport}
          isLoadingTemplate={this.state.isLoadingTemplate}
        />

        <PropertiesImportTxt
          resources={self.props.Resources}
          temporaryToken={self.props.TemporaryToken}
          managementCloudId={self.props.ManagementCloudId}
          propertiesImportOpen={self.state.isPropertiesParametersOpen}
          propertiesTxtClose={self.abortActionTxt}
          language={self.props.Language}
          languages={self.props.Languages}
          domains={self.props.Domains}
          units={self.props.Units}
          dataTypes={self.props.DataTypes}
          editTypes={self.props.EditTypes}
          parameterTypes={self.props.ParameterTypes}
          currentTxtFileName={self.state.currentImportFileName}
          currentTxtPreviewData={self.state.currentPreviewData}
          onCheckExcelImport={self.onCheckDataImport}
          mapImportDatasEdit={self.mapImportDatasEdit}
          editLineDatas={self.state.editLineDatas}
          editLineName={self.state.editLineName}
          propertyEditValid={self.propertyEditValid}
          uploadDataImport={self.uploadDataImport}
          languageTxtImport={self.state.languageTxtImport}
          uploadRevitParameterFile={self.uploadRevitParameterFile}
          changeLanguageTxtImport={self.changeLanguageTxtImport}
          isLoadingTemplate={this.state.isLoadingTemplate}
        />

        <PropertyEdition
          propertyEditionOpen={self.state.ispropertyEditionOpen}
          propertyEditionClose={self.propertyEditionClose}
          temporaryToken={self.props.TemporaryToken}
          managementCloudId={self.props.ManagementCloudId}
          resources={self.props.Resources}
          language={self.props.Language}
          languages={self.props.Languages}
          domains={self.props.Domains}
          units={self.props.Units}
          dataTypes={self.props.DataTypes}
          editTypes={self.props.EditTypes}
          parameterTypes={self.props.ParameterTypes}
          isReadOnly={false}
          isPropertyInCreationMode={self.state.isPropertyInCreationMode}
          selectedProperty={self.state.selectedProperty}
          propertyPanelValidButton={self.state.propertyPanelValidAction}
          propertyPanelTitle={self.state.propertyPanelTitle}
          handleOpenModalDuplicateProperty={self.handleOpenModalDuplicateProperty}
        />

        <PropertiesModal
          open={self.state.showPropertiesModal}
          onConfirm={self.addSelectedProperties}
          onClose={self.closePropertiesModal}
        />

        <Dialog
          open={self.state.openModalDuplicateProperty}
          onClose={self.closeModalDuplicateProperty}
        >
          <DialogTitle>
            {self.props.Resources.ContentManagement.PropertyModalAssociateHeader}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {self.props.Resources.ContentManagement.PropertyModalAssociateContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={self.closeModalDuplicateProperty}>
              {self.props.Resources.MetaResource.Cancel}
            </Button>
            <Button
              onClick={self.handleDuplicateClick}
              variant="contained"
              className="btn-raised"
              disableElevation
            >
              {self.props.Resources.ContentManagement.PropertyModalAssociateButton}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  },
});

const mapStateToProps = function (myStore) {
  const { appState } = myStore;
  const { createPropertyState } = myStore;

  return {
    Domains: createPropertyState.Domains,
    Units: createPropertyState.Units,
    DataTypes: createPropertyState.DataTypes,
    EditTypes: createPropertyState.EditTypes,
    Settings: appState.Settings,
    ParameterTypes: createPropertyState.ParameterTypes,
    PlanType: appState.PlanType,
    ManagementCloudId: selectManagementCloudId(myStore),
    Language: selectLanguageCode(myStore),
    Languages: selectLanguages(myStore),
    Resources: selectTranslatedResources(myStore),
    TemporaryToken: selectToken(myStore),
    properties: selectVisibleProperties(myStore),
    filter: selectFilter(myStore),
    allCurrentProperties: selectProperties(myStore),
    addOfficialPropertiesSuccess: selectAddOfficialPropertiesSuccess(myStore),
    duplicatePropertySuccess: selectDuplicatePropertySuccess(myStore),
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchDictionary: () => dispatch(fetchDictionary()),
  duplicateProperty: (property) => dispatch(duplicateProperty(property)),
  setSortBy: (sortBy) => dispatch(setSortBy(sortBy)),
  setSortOrder: (sortOrder) => dispatch(setSortOrder(sortOrder)),
  selectProperty: (id) => dispatch(selectProperty(id)),
  setFilter: (filter) => dispatch(setFilter(filter)),
  increaseVisibleCount: () => dispatch(increaseVisibleCount()),
  selectAllProperties: (selected) => dispatch(selectAllProperties(selected)),
  addOfficialProperties: (properties) => dispatch(addOfficialProperties(properties)),
  setLoader: (state) => dispatch(setLoaderAction(state)),
});

export default DictionaryProperties = connect(
  mapStateToProps,
  mapDispatchToProps
)(DictionaryProperties);
