/* eslint-disable react/prefer-es6-class */
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import styled from '@emotion/styled';

import Dropzone from 'react-dropzone';
import toastr from 'toastr';

// Material UI
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

// Material UI Icon
import CloudUploadIcon from '@material-ui/icons/CloudUpload.js';
import EditIcon from '@material-ui/icons/Edit.js';
import AddIcon from '@material-ui/icons/Add.js';
import { Icon } from '@bim-co/componentui-foundation';
import MappingModalEdit from './MappingModalEdit.jsx';
import MappingPropertiesListV2 from './MappingPropertiesListV2.jsx';
import MappingMenu from './MappingMenu.jsx';
import PropertiesModal from '../CommonsElements/PropertiesModal.jsx';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import { history } from '../../history';
import { withRouter } from '../../Utils/withRouter';
import Fuse from 'fuse.js';

const mode = {
  MAPPING_BOX: 'MAPPING_BOX',
  NAMING_CONVENTION: 'NAMING_CONVENTION',
};

let DefaultMapping = createReactClass({
  getInitialState() {
    return {
      Id: 0,
      Language: '',
      Name: '',
      RemoveDefault: false,
      isNewConfiguration: true,
      IsPluginDefault: false,
      MappingDictionaryList: [],
      PropertiesDomainList: [],
      PropertiesDomainConnectLaterList: [],
      PropertiesDomainToConnectList: [],
      SearchText: '',
      DictionayMappingIsLoading: true,
      PropertiesConnectedLoaded: false,
      PropertiesLoaded: false,
      PropertyMappingIdToConnect: 0,
      PropertyMappingIsToConnectLater: false,
      PropertyMappingToConnect: null,
      ConnectedPropertiesList: [],
      ConfigurationExist: true,
      DefaultBimAndCoDictionary: null,
      ManagementCloudDictionary: null,
      IsDefault: false,
      LastDataTypeToConnect: '',
      ListIndexMenu: [],
      NbPropertiesConnected: 0,
      NbPropertiesToConnectLater: 0,
      PageMode: mode.NAMING_CONVENTION,
      isDefault: this.props.isDefault ?? false,
      FullPropertiesDomainList: [], 
    };
  },

  showNewConfigurationPage(mappingDictionaryList) {
    this.updateMappingConfigurationURL();
    this.setState({
      Id: 0,
      Name: this.props.Resources.ContentManagementDictionary.NewConfiguration,
      Language: this.props.Language,
      IsPluginDefault: this.state.IsPluginDefault,
      MappingDictionaryList:
        mappingDictionaryList != null ? mappingDictionaryList : this.state.MappingDictionaryList,
      PropertiesDomainList: [],
      PropertiesDomainConnectLaterList: [],
      ConnectedPropertiesList: [],
      DictionayMappingIsLoading: false,
      SearchText: '',
    });
  },

  componentDidMount() {
    this.state.PageMode = this.props?.mode ?? mode.NAMING_CONVENTION;

    this.loadMappingPage(
      this.props.params.configurationId,
      this.props.params.configurationLanguage
    );
  },

  componentWillReceiveProps(nextprops) {
    if (this.props.Language != nextprops.Language) {

      if (this.state.Id > 0) {
        this.loadAllProperties(
          nextprops.Language,
          this.state.Id,
          this.state.Language,
          this.state.SearchText
        );
      } else {
        this.setState({ Language: nextprops.Language });
      }
    }

    if (
      this.props?.mode !== nextprops?.mode ||
      this.props.location.pathname !== nextprops.location.pathname
    ) {
      this.state.PageMode = nextprops?.mode;
      this.loadMappingPage();
    }
  },

  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.loadMappingPage(
        this.props.params.configurationId,
        this.props.params.configurationLanguage
      );
    }
  },

  loadAllProperties(
    language,
    configurationId,
    configurationlanguage = '',
    searchText = '',
    loadConnectedProperties = true
  ) {
    if (!loadConnectedProperties) {
      this.state.PropertiesConnectedLoaded = true;
    }

    if (this.state.DictionayMappingIsLoading == false && this.state.SearchText == '') {
      this.setState({ DictionayMappingIsLoading: true });
    }

    this.getDictionaryMappingProperties(
      language,
      configurationId,
      configurationlanguage,
      searchText
    );

    if (loadConnectedProperties) {
      this.getDictionaryMappingConnectedProperties(
        language,
        configurationId,
        configurationlanguage,
        searchText
      );
    }
  },

  afterAllPropertiesLoaded() {
    if (this.state.PropertiesLoaded && this.state.PropertiesConnectedLoaded) {
      if (this.state.PageMode == mode.NAMING_CONVENTION) {
        this.updateMappingConfigurationURL(this.state.Id, this.state.Language);
      }

      this.setState({
        DictionayMappingIsLoading: false,
        PropertiesLoaded: false,
        PropertiesConnectedLoaded: false,
      });
    }
  },

  getDictionaryMappingProperties(
    language,
    configurationId,
    configurationlanguage = '',
    searchText = ''
  ) {
    const self = this;

    let urlParamLang = '';

    if (configurationlanguage != null && configurationlanguage != '') {
      urlParamLang = `/${configurationlanguage}`;
    }

    let urlWS = '';

    if (configurationId === undefined || configurationId === 0) {
      return;
    }
    
    switch (this.state.PageMode) {
      case mode.MAPPING_BOX:
        urlWS = `/api/ws/v1/${language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mappingbox/properties/list?token=${this.props.TemporaryToken}`;
        break;
      case mode.NAMING_CONVENTION:
        urlWS = `/api/ws/v1/${language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/${configurationId}${urlParamLang}/properties/list?token=${this.props.TemporaryToken}`;
        break;
    }

    const request = { Search: searchText };

    if (urlWS != '') {
      fetch(API_URL + urlWS, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((dictionary) => { 
          if (dictionary != null) {
            self.state.PropertiesLoaded = true;

            let nbPropertiesToConnectLater = 0;

            if (dictionary.Id > 0) {
              _.each(dictionary.DomainConnectLaterList, (domain) => {
                nbPropertiesToConnectLater +=
                  domain.PropertyList != null ? domain.PropertyList?.length : 0;
              });
              self.state.Id = dictionary.Id;
              self.state.Name = dictionary.Name;
              self.state.IsPluginDefault = dictionary.IsPluginDefault;
              self.state.IsDefault = dictionary.IsDefault;
              self.state.Language = dictionary.LanguageCode;
              self.state.PropertiesDomainList = dictionary.DomainList;
              
              self.state.FullPropertiesDomainList = dictionary.DomainList;
              
              self.state.PropertiesDomainConnectLaterList = dictionary.DomainConnectLaterList;
            } else {
              self.state.Language = configurationlanguage;
            }
            self.state.NbPropertiesToConnectLater = nbPropertiesToConnectLater;

            self.afterAllPropertiesLoaded();
          }
        });
    }
  },

  getDictionaryMappingConnectedProperties(
    language,
    configurationId,
    configurationlanguage = '',
    searchText = ''
  ) {
    const self = this;

    let urlParamLang = '';

    if (configurationlanguage != null && configurationlanguage != '') {
      urlParamLang = `/${configurationlanguage}`;
    }

    let urlWS = '';

    if (
      window.location.pathname.includes('default-mapping') &&
      (configurationId === undefined || configurationId === 0)
    ) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (this.state.PageMode) {
      case mode.MAPPING_BOX:
        urlWS = `/api/ws/v1/${language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mappingbox/properties/connected/list?token=${this.props.TemporaryToken}`;
        break;
      case mode.NAMING_CONVENTION:
        urlWS = `/api/ws/v1/${language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/${configurationId}${urlParamLang}/properties/connected/list?token=${this.props.TemporaryToken}`;
        break;
    }

    const request = { Search: searchText };

    fetch(API_URL + urlWS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((connectedPropertiesList) => {
        let nbPropertiesConnected = 0;

        _.each(connectedPropertiesList, (domain) => {
          nbPropertiesConnected += domain.PropertyList != null ? domain.PropertyList?.length : 0;
        });

        self.state.PropertiesConnectedLoaded = true;
        self.state.ConnectedPropertiesList = connectedPropertiesList;
        self.state.NbPropertiesConnected = nbPropertiesConnected;

        self.afterAllPropertiesLoaded();
      });
  },

  getDictionaryPropertiesToConnect(property, isToConnectLater) {
    const self = this;

    if (
      property.DataTypeName != this.state.LastDataTypeToConnect ||
      this.state.PageMode == mode.MAPPING_BOX
    ) {
      store.dispatch({ type: 'LOADER', state: true });

      let urlWS = '';

      switch (this.state.PageMode) {
        case mode.MAPPING_BOX:
          urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mappingbox/property/${property.Id}/connect/list?token=${this.props.TemporaryToken}`;
          break;
        case mode.NAMING_CONVENTION:
          urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/property/${property.DataTypeName}/connect/list?token=${this.props.TemporaryToken}`;
          break;
      }

      fetch(API_URL + urlWS, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((propertiesDomainToConnectList) => {
          self.setState(
            {
              PropertyMappingIdToConnect: property.Id,
              PropertiesDomainToConnectList: propertiesDomainToConnectList,
              PropertyMappingIsToConnectLater: Boolean(isToConnectLater),
              LastDataTypeToConnect: property.DataTypeName,
              PropertyMappingToConnect: property,
            },
            () => {
              $('#AddPropertyScreen').modal('show');
            }
          );

          store.dispatch({ type: 'LOADER', state: false });
        });
    } else {
      this.setState(
        {
          PropertyMappingIdToConnect: property.Id,
          PropertyMappingIsToConnectLater: Boolean(isToConnectLater),
          PropertyMappingToConnect: property,
        },
        () => {
          $('#AddPropertyScreen').modal('show');
        }
      );
    }
  },

  handleDefaultSearch(searchText) {
    const options = {
      threshold: 0.22, // 0 perfect match, 1 match anything
      minMatchCharLength: 2,
      keys: ['Name'],
    }

    const result = [...this.state.FullPropertiesDomainList.map(
        (domain, i) => {
          const fuse = new Fuse(domain.PropertyList, { ...options });
          this.state.FullPropertiesDomainList[i].PropertyList = fuse.search(searchText).map(({item})=> item);
          return domain;
        }
    )]
    return result || [];
  },

  handleSearchChange(event) {
    const self = this;
    const searchText = event.currentTarget.value;
    this.state.SearchText = searchText;
    const renderSearchResult = this.handleDefaultSearch(searchText)
    setTimeout(() => {
      if (self.state.SearchText === searchText && searchText !== '') {
        this.setState({
          PropertiesDomainList: renderSearchResult ? renderSearchResult : []
        });
      }
    }, 1400);
    if (self.state.SearchText === searchText) {
      self.loadAllProperties(self.props.Language, self.state.Id, self.state.Language, searchText);
    }
  },

  openModalProperties(property, isToConnectLater) {
    this.getDictionaryPropertiesToConnect(property, isToConnectLater);
  },

  onFileRejected() {
    this.onDropzoneDragLeave();

    toastr.error(this.props.Resources.ContentManagement.FileNotSupported);
  },

  onSharedParametersFileDrop(file, languageCode, functionCallBack) {
    if (file != null && file?.length > 0) {
      const uploadFile = file[0];
      let dictionaryName = '';

      if (this.state.Id == 0) {
        dictionaryName = uploadFile.name;
        dictionaryName = dictionaryName.substring(0, dictionaryName.lastIndexOf('.')); // Remove file extension
      }

      this.uploadDictionaryMapping(
        uploadFile,
        this.state.Id,
        dictionaryName,
        languageCode,
        functionCallBack
      );
    }
  },

  uploadDictionaryMapping(
    file,
    dictionaryId,
    dictionaryName,
    dictionaryLanguage,
    functionCallBack
  ) {
    const self = this;

    if (file != null) {
      const data = new FormData();
      data.append('file', file);

      if (dictionaryId != null && dictionaryId > 0) {
        data.append('ConfigurationId', dictionaryId);
      }
      if (dictionaryName != null && dictionaryName != '') {
        data.append('ConfigurationName', dictionaryName);
      }

      const dropzoneProgressBarList = document.querySelectorAll(
        '#dropzone-container .dropzone-progress-bar'
      );

      if (dropzoneProgressBarList != null && dropzoneProgressBarList?.length > 0) {
        _.each(dropzoneProgressBarList, (progressBar) => {
          progressBar.classList.remove('hidden');
        });
      }

      let language = this.state.Language;

      if (dictionaryLanguage != null && dictionaryLanguage != '') {
        language = dictionaryLanguage;
      }

      fetch(
        `${API_URL}/api/ws/v1/${language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/upload?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          body: data,
        }
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((newMappingDictionary) => {
          if (dropzoneProgressBarList != null && dropzoneProgressBarList?.length > 0) {
            _.each(dropzoneProgressBarList, (progressBar) => {
              progressBar.classList.add('hidden');
            });
          }

          if (newMappingDictionary != null) {
            // If is a new configuration
            if (
              _.findLastIndex(self.state.MappingDictionaryList, { Id: newMappingDictionary.Id }) ==
              -1
            ) {
              const mappingDictionary = {
                Id: newMappingDictionary.Id,
                Name: newMappingDictionary.Name,
                IsPluginDefault: newMappingDictionary.IsPluginDefault,
                IsDefault: newMappingDictionary.IsDefault,
              };
              self.state.MappingDictionaryList.push(mappingDictionary);

              self.state.MappingDictionaryList = _.sortBy(self.state.MappingDictionaryList, 'Name');
            }

            if (functionCallBack != null) {
              functionCallBack();
            }

            if (self.state.Language == newMappingDictionary.LanguageCode) {
              self.loadAllProperties(
                self.props.Language,
                newMappingDictionary.Id,
                newMappingDictionary.LanguageCode
              );
            }
          }
        });
    }
  },

  onDropzoneDragEnter() {
    const dropzoneIconList = document.querySelectorAll('#dropzone-container .dropzone-icon');

    if (dropzoneIconList != null && dropzoneIconList?.length > 0) {
      _.each(dropzoneIconList, (dropzoneIcon) => {
        dropzoneIcon.classList.add('on-drag');
      });
    }
  },

  onDropzoneDragLeave() {
    const dropzoneIconList = document.querySelectorAll('#dropzone-container .dropzone-icon');

    if (dropzoneIconList != null && dropzoneIconList?.length > 0) {
      _.each(dropzoneIconList, (dropzoneIcon) => {
        dropzoneIcon.classList.remove('on-drag');
      });
    }
  },

  connectProperty(propertyMappingIdToConnect, propertyToConnect, functionCallBack) {
    const self = this;

    let urlWS = '';

    switch (this.state.PageMode) {
      case mode.MAPPING_BOX:
        urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mappingbox/property/${propertyMappingIdToConnect}/connect/property/${propertyToConnect.Id}?token=${this.props.TemporaryToken}`;
        break;
      case mode.NAMING_CONVENTION:
        urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/property/${propertyMappingIdToConnect}/connect/property/${propertyToConnect.Id}?token=${this.props.TemporaryToken}`;
        break;
    }

    fetch(API_URL + urlWS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((data) => {
        if (data != null) {
          self.loadAllProperties(
            self.props.Language,
            self.state.Id,
            self.state.Language,
            self.state.SearchText
          );

          if (functionCallBack != null) {
            functionCallBack();
          }
        }
      });
  },

  disconnectProperty(propertyMappingIdToDisconnect, isToConnectLater, functionCallBack) {
    const self = this;

    let urlWS = '';

    switch (this.state.PageMode) {
      case mode.MAPPING_BOX:
        urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mappingbox/property/${propertyMappingIdToDisconnect}/disconnect?token=${this.props.TemporaryToken}`;
        break;
      case mode.NAMING_CONVENTION:
        urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/property/${propertyMappingIdToDisconnect}/disconnect?token=${this.props.TemporaryToken}`;
        break;
    }

    if (isToConnectLater != null && isToConnectLater == true) {
      urlWS += '&toConnectLater=true';
    }

    fetch(API_URL + urlWS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((data) => {
        if (data != null) {
          self.loadAllProperties(
            self.props.Language,
            self.state.Id,
            self.state.Language,
            self.state.SearchText
          );

          if (functionCallBack != null) {
            functionCallBack();
          }
        }
      });
  },

  handleSelectConfigurationLanguage(event) {
    const languageCode = event.target.value;

    if (this.state.Language !== languageCode) {
      const configurationId = this.state.Id;
      this.state.Id = 0;
      this.state.SearchText = '';

      if (configurationId > 0) {
        this.loadAllProperties(this.props.Language, configurationId, languageCode);
      } else {
        this.setState({ Language: languageCode });
      }
    }
  },

  handleSelectConfiguration(event) {
    let configurationId = null;

    if (typeof event === 'number') {
      configurationId = event;
    } else {
      configurationId = event.target.value;
    }

    switch (configurationId) {
      case 0:
        if (this.state.Id !== configurationId) {
          // Add new configuration
          this.showNewConfigurationPage();
        }
        break;
      default:
        if (configurationId > 0 && this.state.Id !== configurationId) {
          this.state.Id = 0;
          this.state.SearchText = '';

          this.loadAllProperties(this.props.Language, configurationId);
        }
        break;
    }
  },

  getAllDictionaryMapping(configId = 0, configLang = '') {
    const self = this;
    const urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/list?token=${this.props.TemporaryToken}`;

    fetch(API_URL + urlWS, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((mappingDictionaryList) => {
        if (mappingDictionaryList != null) {
          mappingDictionaryList = _.sortBy(mappingDictionaryList, 'Name');

          if (mappingDictionaryList?.length > 0) {
            let configurationExist = true;
            let id = !this.state.isDefault
              ? mappingDictionaryList[0].Id
              : mappingDictionaryList?.find((configuration) => configuration?.IsDefault)?.Id ?? 0;

            let language = '';

            if (configId != null && configId > 0) {
              configId = parseInt(configId, 10);

              if (configId > 0 && _.findLastIndex(mappingDictionaryList, { Id: configId }) > -1) {
                id = configId;
              } else {
                // La configuration n'existe pas
                configurationExist = false;
              }
            }

            if (configLang != null && configLang != '') {
              if (_.findLastIndex(self.props.Languages, { LanguageCode: configLang }) > -1) {
                language = configLang;
              } else {
                // La langue de la configuration n'existe pas
                configurationExist = false;
              }
            }

            if (configurationExist) {
              self.state.MappingDictionaryList = mappingDictionaryList;

              self.loadAllProperties(self.props.Language, id, language);
            } else {
              self.setState({
                MappingDictionaryList: mappingDictionaryList,
                ConfigurationExist: configurationExist,
                DictionayMappingIsLoading: false,
              });
            }
          } else {
            self.showNewConfigurationPage(mappingDictionaryList);
          }
        }
      });
  },

  updateMappingConfigurationURL(configurationId = 0, configurationLanguage = '') {
    if (
      (configurationId !== this.props.params.configurationId ||
        configurationLanguage !== this.props.params.configurationLanguage) &&
      !this.props.isDefault
    ) {
      let newUrl = '';

      if (configurationId > 0 && configurationLanguage !== '') {
        newUrl = `/${this.props.Language}/dictionary/mapping/${configurationId}/${configurationLanguage}`;
      } else if (configurationId > 0) {
        newUrl = `/${this.props.Language}/dictionary/mapping/${configurationId}`;
      } else {
        newUrl = `/${this.props.Language}/dictionary/mapping`;
      }

      history.push(newUrl);
    }
  },

  getDefaultBimAndCoDictionary() {
    const self = this;
    const urlWS = `/api/ws/v1/${this.props.Language}/propertiesgroup/defaultbimandcodictionary/informations?token=${this.props.TemporaryToken}`;

    fetch(API_URL + urlWS, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((defaultBimAndCoDictionary) => {
        if (defaultBimAndCoDictionary != null) {
          self.setState({ DefaultBimAndCoDictionary: defaultBimAndCoDictionary });
        }
      });
  },

  getManagmentCloudDictionnary() {
    const self = this;
    const urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/information?token=${this.props.TemporaryToken}`;

    fetch(API_URL + urlWS, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((managementCloudDictionary) => {
        if (managementCloudDictionary != null) {
          let configurationExist = self.state.ConfigurationExist;

          if (
            self.state.PageMode == mode.MAPPING_BOX &&
            managementCloudDictionary.IsBimAndCoDefaultDictionary
          ) {
            configurationExist = false;
          }

          self.setState({
            ManagementCloudDictionary: managementCloudDictionary,
            ConfigurationExist: configurationExist,
          });
        }
      });
  },

  loadMappingPage(configurationId = 0, configurationLang = '') {
    if (this.props.Settings.EnableDictionary) {
      switch (this.state.PageMode) {
        case mode.MAPPING_BOX:
          this.getManagmentCloudDictionnary();
          this.getDefaultBimAndCoDictionary();
          this.loadAllProperties(this.props.Language);

          break;
        case mode.NAMING_CONVENTION:
          this.state.DictionayMappingIsLoading = true;
          this.state.ConfigurationExist = true;

          this.getManagmentCloudDictionnary();
          this.getAllDictionaryMapping(configurationId, configurationLang);
          break;
      }
    }
  },

  handleButtonGoToMapping() {
    this.loadMappingPage();
  },

  scrollToElement(type, id) {
    if (this.state.ListIndexMenu != null && this.refList != null) {
      let index = -1;

      switch (type) {
        case 'domain-title':
          index = _.findLastIndex(this.state.ListIndexMenu, {
            type,
            id,
          });
          break;
        case 'connected-properties-list':
        case 'connect-later-title':
          index = _.findLastIndex(this.state.ListIndexMenu, {
            type,
          });
          break;
      }

      if (index > -1) {
        const indexToScroll = this.state.ListIndexMenu[index].index;

        this.refList.measureAllRows();
        this.refList.scrollToRow(indexToScroll);
      }
    }
  },

  handleClickDomainMenu(event, domain) {
    this.scrollToElement('domain-title', domain.Id);
  },

  handleClickMenuConnected(event) {
    this.scrollToElement('connected-properties-list');
  },

  handleClickMenuToConnectLater(event) {
    this.scrollToElement('connect-later-title');
  },

  handleClickButtonConnectLater(propertyMappingIdList) {
    const self = this;
    const urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/property/connectlater?token=${this.props.TemporaryToken}`;

    fetch(API_URL + urlWS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyMappingIdList),
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((data) => {
        if (data != null) {
          self.loadAllProperties(
            self.props.Language,
            self.state.Id,
            self.state.Language,
            self.state.SearchText,
            false
          );
        }
      });
  },

  openModalEditConfiguration() {
    $('#mapping-modal-edit').modal('show');
  },

  resetIsPluginDefault(mappingDictionaryList) {
    const newMappingDictionaryList = mappingDictionaryList.map((dictionary) => {
      dictionary.IsPluginDefault = false;
      return dictionary;
    });

    return newMappingDictionaryList;
  },

  updateMappingName(configurationId, configurationName, IsPluginDefault) {
    let mappingDictionaryList = this.state.MappingDictionaryList;
    const indexConfiguration = _.findLastIndex(mappingDictionaryList, { Id: configurationId });

    if (indexConfiguration > -1) {
      mappingDictionaryList[indexConfiguration].Name = configurationName;

      // remove old plugindefault and add new one in the list
      mappingDictionaryList = this.resetIsPluginDefault(mappingDictionaryList);
      mappingDictionaryList[indexConfiguration].IsPluginDefault = IsPluginDefault;

      mappingDictionaryList = _.sortBy(mappingDictionaryList, 'Name');

      this.setState({
        Name: configurationName,
        MappingDictionaryList: mappingDictionaryList,
        IsPluginDefault,
      });
    }
  },

  deleteConfiguration(configurationId, configurationLanguage, setLanguageList) {
    const self = this;
    const urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/${configurationId}/${configurationLanguage}/delete?token=${this.props.TemporaryToken}`;

    if (configurationId != null && configurationId > 0) {
      fetch(API_URL + urlWS, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((languageList) => {
          if (languageList != null) {
            if (languageList?.length > 0) {
              setLanguageList(languageList);

              if (self.state.Language == configurationLanguage) {
                self.loadAllProperties(self.props.Language, configurationId, configurationLanguage);
              }
            } else {
              // If configuration was completely deleted
              $('#mapping-modal-edit').modal('hide');
              self.getAllDictionaryMapping();
            }
          }
        });
    }
  },

  setListRef(ref) {
    this.refList = ref;
  },

  setListIndexMenu(list) {
    this.state.ListIndexMenu = list;
  },

  /* eslint-disable max-lines-per-function */
  render() {
    const self = this;

    if (!this.props.Settings.EnableDictionary) {
      return (
        <div className="text-center">
          <h1 className="loadingtext">BIM&CO - ONFLY</h1>
          <p>Error 403 Access Denied</p>
        </div>
      );
    }

    let propertiesContainer;
    const mappingConfigurationIsEmpty =
      self.state.Id === 0 ||
      (self.state.Id > 0 &&
        self.state.ConnectedPropertiesList?.length === 0 &&
        self.state.PropertiesDomainList?.length === 0 &&
        self.state.PropertiesDomainConnectLaterList === 0);

    const dropzoneSharedParametersFile = (
      <div id="dropzone-container">
        <Dropzone
          multiple={false}
          onDropAccepted={(file, event) =>
            this.onSharedParametersFileDrop(file, this.state.Language)
          }
          onDropRejected={this.onFileRejected}
          onDragEnter={this.onDropzoneDragEnter}
          onDragLeave={this.onDropzoneDragLeave}
          accept=".txt"
          maxSize={31457280}
          className="dropzone-upload-file dropzone-area"
        >
          <div className="dropzone-icon-container">
            <CloudUploadIcon className="dropzone-icon" />
          </div>
          <Typography className="dropzone-title" variant="h6" gutterBottom>
            {self.props.Resources.ContentManagementDictionary.UploadSharedParametersFile}
          </Typography>
          <Typography className="dropzone-subtitle legende" variant="subtitle1" gutterBottom>
            {self.props.Resources.ContentManagementDictionary.SupportedSharedParametersFiles}
          </Typography>
          <LinearProgress className="dropzone-progress-bar hidden" />
        </Dropzone>
      </div>
    );

    if (self.state.ConfigurationExist) {
      if (mappingConfigurationIsEmpty && self.state.SearchText !== '') {
        propertiesContainer = (
          <Typography className="no-result" variant="h6">
            {self.props.Resources.MetaResource.NoResult}
          </Typography>
        );
      } else if (!mappingConfigurationIsEmpty || self.state.SearchText !== '') {
        propertiesContainer = (
          <MappingPropertiesListV2
            SelectorDomainList="#dictionary-domains #lp-nav-container"
            Language={self.props.Language}
            Resources={self.props.Resources}
            ConnectedPropertiesList={self.state.ConnectedPropertiesList}
            PropertiesDomainList={self.state.PropertiesDomainList}
            PropertiesDomainConnectLaterList={self.state.PropertiesDomainConnectLaterList}
            DisconnectProperty={self.disconnectProperty}
            HandleClickButtonConnectLater={self.handleClickButtonConnectLater}
            HandleClickButtonConnect={self.openModalProperties}
            SetListRef={self.setListRef}
            SetListIndexMenu={self.setListIndexMenu}
            SelectedTabType={self.props.SelectedTabType === 'TO_CONNECT' ? 'TO_CONNECT' : ''}
          />
        );
      } else if (!self.state.DictionayMappingIsLoading) {
        if (this.state.PageMode === mode.NAMING_CONVENTION) {
          propertiesContainer = dropzoneSharedParametersFile;
        }
      } else {
        propertiesContainer = <CircularProgress className="circular-progress" />;
      }
    } else {
      switch (this.state.PageMode) {
        case mode.MAPPING_BOX:
          propertiesContainer = (
            <div className="error-container">
              <Typography variant="h4" gutterBottom>
                {self.props.Resources.ContentManagement.Error404}
              </Typography>
            </div>
          );
          break;
        case mode.NAMING_CONVENTION:
          propertiesContainer = (
            <div className="error-container">
              <Typography variant="h4" gutterBottom>
                {self.props.Resources.ContentManagement.Error404}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {self.props.Resources.ContentManagementDictionary.MappingDoesntExist}
              </Typography>
              <Button
                variant="contained"
                className="btn-raised btn-go-to-mapping"
                onClick={self.handleButtonGoToMapping}
              >
                {self.props.Resources.ContentManagementDictionary.GoToMapping}
              </Button>
            </div>
          );
          break;
        default:
          break;
      }
    }

    let mappingTitle;
    let mappingLanguage;
    let editButton;
    let defaultDictionaryTitle; // Top bar
    const dictionaryName =
      this.state.ManagementCloudDictionary != null ? this.state.ManagementCloudDictionary.Name : '';
    let showFilterPropertiesModal = true;

    switch (this.state.PageMode) {
      case mode.MAPPING_BOX:
        mappingTitle = (
          <Typography variant="h5" className="dictionary-title">
            {dictionaryName}
          </Typography>
        );

        defaultDictionaryTitle =
          this.state.DefaultBimAndCoDictionary != null
            ? this.state.DefaultBimAndCoDictionary.Name
            : '';
        showFilterPropertiesModal = false;

        break;
      case mode.NAMING_CONVENTION:
        if (this.state.ConfigurationExist) {

          const languagesList = _.map(self.props.Languages, (lang, i) => {
            const keys = _.keys(lang.Translations);
            let language_trad = '';
            if (_.contains(keys, self.props.Language)) {
              language_trad = lang.Translations[self.props.Language];
            } else {
              language_trad = lang.DefaultName;
            }

            if (lang.IsInterface) {
              return (
                <MenuItem
                  key={`lang-${lang.LanguageCode}`}
                  className="menu-item-language"
                  value={lang.LanguageCode}
                >
                  <ListItemIcon>
                    <span className={`language-icon lang-${lang.LanguageCode}`} />
                  </ListItemIcon>
                  <ListItemText inset primary={language_trad} className="lang-name" />
                </MenuItem>
              );
            }
          });

          if (this.props.isDefault) {
            mappingTitle = (
              <Typography variant="h5" className="dictionary-title">
                {this.state.Name}
              </Typography>
            );
          } else {
            mappingTitle = (
              <FormControl id="mapping-configuration-list">
                <Select
                  name="Configuration"
                  value={this.state.Id}
                  className="select-configuration"
                  onChange={this.handleSelectConfiguration}
                  input={<Input id="input-select-configuration" disableUnderline />}
                  renderValue={(configuration) => this.state.Name}
                  inputProps={{ className: 'input-configuration' }}
                  MenuProps={{
                    MenuListProps: { className: 'menu-list-configuration' },
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem key="add-configuration" className="menu-item-configuration" value={0}>
                    <ListItemIcon>
                      <AddIcon className="item-icon" />
                    </ListItemIcon>
                    <ListItemText
                      inset
                      primary={this.props.Resources.ContentManagementDictionary.NewConfiguration}
                      className="configuration-name"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            );
          }

          if (!self.state.DictionayMappingIsLoading) {
            mappingLanguage = (
              <div id="mapping-configuration-language-container">
                <FormControl id="mapping-configuration-language">
                  <Select
                    name="Language"
                    value={this.state.Language}
                    className="select-configuration-language"
                    onChange={this.handleSelectConfigurationLanguage}
                    input={<Input id="input-select-configuration-language" disableUnderline />}
                    renderValue={(languageCode) => (
                      <span className={`language-icon lang-${languageCode}`} />
                    )}
                    MenuProps={{
                      getContentAnchorEl: null,
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {languagesList}
                  </Select>
                </FormControl>
              </div>
            );
          }
        }

        if (this.state.Id > 0) {
          editButton = (
            <Button
              className="btn-edit-configuration"
              onClick={this.openModalEditConfiguration}
              size="small"
            >
              <EditIcon className="edit-icon" />
              <span className="text-edit">
                {this.props.Resources.ContentManagementDictionary.EditConfiguration}
              </span>
            </Button>
          );

          mappingLanguage = <span className={`language-icon lang-${this.state.Language}`} />;
        }

        defaultDictionaryTitle = dictionaryName;

        break;
      default:
        break;
    }

    return (
      <div id="dictionary-mapping">
        <MappingMenu
          IsDefaultMapping
          DomainList={
            !mappingConfigurationIsEmpty || self.state.SearchText != ''
              ? self.state.PropertiesDomainList
              : null
          }
          NbPropertiesConnected={self.state.NbPropertiesConnected}
          NbPropertiesToConnectLater={self.state.NbPropertiesToConnectLater}
          HandleClickMenuConnected={self.handleClickMenuConnected}
          HandleClickMenuDomain={self.handleClickDomainMenu}
          HandleClickMenuToConnectLater={self.handleClickMenuToConnectLater}
          HandleChangeSearch={
            !mappingConfigurationIsEmpty || self.state.SearchText != ''
              ? self.handleSearchChange
              : null
          }
        />
        <div id="dictionary-properties-mapping">
          <div id="top-bar-container">
            <div className="vertical-divider-container">
              <div id="top-bar">
                <div>
                  {self.state.ConfigurationExist ? (
                    <TitleDiv id="mapping-configuration-container">
                      {mappingTitle}
                      {self.state.IsPluginDefault && <Icon color="primary" icon="check" />}
                    </TitleDiv>
                  ) : null}
                  {!self.state.IsDefault && mappingLanguage}
                  {!self.state.IsDefault && editButton}
                </div>
                {!mappingConfigurationIsEmpty || self.state.SearchText != '' ? (
                  <div>
                    <div id="default-dictionary-container">
                      <Typography variant="h5" className="dictionary-title">
                        {defaultDictionaryTitle}
                      </Typography>
                    </div>
                  </div>
                ) : null}
              </div>
              <div>
                {!mappingConfigurationIsEmpty || self.state.SearchText != '' ? (
                  <div className="vertical-divider" />
                ) : null}
                <div className="cale" />
              </div>
            </div>
            <div className="cale-container">
              <div className="cale" />
            </div>
          </div>
          <div id="properties-container">{propertiesContainer}</div>
        </div>
        <PropertiesModal
          properties={self.state.PropertiesDomainToConnectList}
          showSelectFilters={showFilterPropertiesModal}
          propertyMappingIdToConnect={self.state.PropertyMappingIdToConnect}
          connectProperty={self.connectProperty}
          disconnectProperty={self.disconnectProperty}
          propertyMappingIsToConnectLater={self.state.PropertyMappingIsToConnectLater}
          showBtnCreateNewProperty
          propertyMappingToConnect={self.state.PropertyMappingToConnect}
        />
        <MappingModalEdit
          Id={self.state.Id}
          Name={self.state.Name}
          IsPluginDefault={self.state.IsPluginDefault}
          ConfigurationLanguage={self.state.Language}
          MappingConfigurationIsEmpty={mappingConfigurationIsEmpty}
          HandleClickSaveName={self.updateMappingName}
          OnFileRejected={self.onFileRejected}
          OnDropzoneDragEnter={self.onDropzoneDragEnter}
          OnDropzoneDragLeave={self.onDropzoneDragLeave}
          OnSharedParametersFileDrop={self.onSharedParametersFileDrop}
          DeleteConfiguration={self.deleteConfiguration}
        />
      </div>
    );
  },
});

const TitleDiv = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 100px;
  align-items: center;
`;

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    ManagementCloudId: appState.ManagementCloudId,
    Language: appState.Language,
    Resources: appState.Resources[appState.Language],
    TemporaryToken: appState.TemporaryToken,
    Languages: appState.Languages,
    Settings: appState.Settings,
  };
};

export default DefaultMapping = withRouter(connect(mapStateToProps)(DefaultMapping));
