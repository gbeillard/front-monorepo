/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import _ from 'underscore';

import { OCAnalytics } from '@bim-co/onfly-connect';

import * as types from '../Actions/app-actions';
import * as GeneralApi from '../Api/GeneralApi.js';
import * as SearchApi from '../Api/SearchApi.js';
import * as PinsApi from '../Api/PinsApi.js';
import resourcesListParam from './resources.js';
import * as Utils from '../Utils/utils.js';
import * as QWebChannelUtils from '../Utils/qwebchannelUtils.js';
import * as MappingApi from '../Api/MappingApi.js';
import * as BundleUtils from '../Utils/bundleUtils.js';
import {
  SET_LOADER,
  FETCH_DOCUMENT_TYPES_SUCCESS,
  FETCH_LANGUAGES_SUCCESS,
  SET_URL,
} from './app/constants';
import {
  CHECK_AUTHENTICATION_ERROR,
  GET_USER_INFO_SUCCESS,
  SET_TOKEN,
  SET_PERMANENT_TOKEN,
  GET_USER_INFO_ERROR,
  CHECK_AUTHENTICATION,
} from './authentication/types';

export const initialState = {
  IsEditingResource: false,
  ManagementCloudId: '',
  EntityId: '',
  EntityType: '',
  EntityLogo: '',
  EntityName: '',
  PlatformUrl: '',
  SubDomain: '',
  Title: '',
  Language: '',
  Resources: {},
  UserIsAuthenticated: false,
  AuthenticationLoading: false,
  AuthenticationSuccess: false,
  AuthenticationError: undefined,
  UserId: '',
  UserFirstName: '',
  UserlastName: '',
  UserAvatar: '',
  UserJob: '',
  UserEmail: '',
  UserCity: '',
  RoleId: '',
  RoleKey: '',
  IsBimAndCoAdmin: false,
  HasGroupsSubscription: false,
  RoleName: '',
  AuthToken: '',
  TemporaryToken: '',
  PermanentToken: '',
  Roles: [],
  Languages: [],
  Softwares: [],
  Loader: false,
  DefaultSelectedTabDetailsPage: 'data',
  Civilities: [],
  Countries: [],
  Functions: [],
  Activities: [],
  CompaniesSize: [],
  UserDetails: null,
  DocumentTypes: [],
  UnreadMessagesCount: 0,
  Ready: false,
  Settings: null,
  Group: {},
  CookieProcessed: false,
  UserSettings: [],
  SocketStatus: false,
  SocketStatusSend: false,
  Name: '',
  PlanType: 0,

  // UPLOAD
  page: 'ChooseProject',
  objectsList: [],
  mapping: [],
  mappingConnected: [],
  objectRev: 0,
  variantSelectedCount: 0,
  bundle: [],
  bundleId: null,
  defaultMappingLoaded: false,
  uploadInProgress: false,

  // summary upload
  SummaryUploadListIds: [],
  SummaryUploadDetailsList: [],
};

/* eslint-disable max-lines-per-function */
const appReducer = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    // INFORMATIONS
    case types.UPDATE_INFORMATIONS_CONTEXT:
      if (action.data.EntityId != undefined) {
        localStorage.setItem('ApiKey', action.data.ApiKey);

        const queryParams = new URLSearchParams(window.location.search);
        let permanentToken = queryParams.get('token');
        const accessToken =
          queryParams.get('access_token') || localStorage.getItem('Temporary_token');
        const refreshToken = queryParams.get('refresh_token');
        localStorage.setItem('Code_token', '');
        if (permanentToken) {
          localStorage.setItem('Auth_token', permanentToken);
          localStorage.setItem('Temporary_token', '');
          localStorage.setItem('Refresh_token', '');
          localStorage.setItem('UserId', '');
          localStorage.setItem('Auth_token', '');
          // JM : Pour la migration vers le nouveau SSO
          localStorage.setItem('SubjectId', '');
          // this.props.dispatch(setPermanentToken(permanentToken));
        }

        if (accessToken) {
          // this.props.dispatch(setToken(accessToken));
          localStorage.setItem('Temporary_token', accessToken);
          localStorage.setItem('IsAuthenticatedUpload', true);
        }

        if (refreshToken) {
          localStorage.setItem('Refresh_token', refreshToken);
        }

        if (permanentToken == null || permanentToken == '') {
          permanentToken = localStorage.getItem('Auth_token');
        }

        if (permanentToken != '' && Utils.validateGUID(permanentToken)) {
          GeneralApi.getTemporaryKey(permanentToken, action.data.ContentManagementId);
        } else {
          permanentToken = '';
        }

        state.page = setPage('ChooseProject', action.data.Settings, state.SubDomain);

        // tant pis
        localStorage.setItem('OnflyClientId', action.data.Consumer.ClientId);
        localStorage.setItem('OnflyId', action.data.ContentManagementId);

        return {
          ...state,
          EntityId: action.data.EntityId,
          EntityType: action.data.EntityType,
          ManagementCloudId: action.data.ContentManagementId,
          EntityLogo: action.data.EntityLogo,
          EntityName: action.data.EntityName,
          PlatformUrl: action.data.PlatformUrl,
          SubDomain: action.data.SubDomain,
          AuthToken: permanentToken,
          Settings: action.data.Settings,
          HasGroupsSubscription: action.data.HasGroupsSubscription,
          CookieProcessed: true,
          AuthenticationLoading: permanentToken !== '' && permanentToken !== null,
          Name: action.data.Name,
          PlanType: action.data.PlanType,
        };
      }
      return { ...state, ManagementCloudId: -1 };

    // RESOURCES
    case types.UPDATE_RESOURCES: {
      const resources = { ...state.Resources };
      for (const i in action.data) {
        const data = action.data[i];
        if (typeof resources[action.language] === 'undefined') {
          resources[action.language] = [];
        }
        if (typeof resources[action.language][data.Area] === 'undefined') {
          resources[action.language][data.Area] = [];
        }

        let value = data.Value;
        if (data.Value == null) {
          value = `[${data.Area} : ${data.Key}]`;
        }

        if (action.isEditingResource) {
          resources[action.language][data.Area][data.Key] = `[${data.Area} : ${data.Key}]`;
        } else {
          resources[action.language][data.Area][data.Key] = value;
        }
      }

      return {
        ...state,
        Resources: resources,
        IsEditingResource: action.isEditingResource,
        Ready: typeof resources[state.Language] !== 'undefined',
      };
    }
    case types.TOGGLE_EDIT_RESOURCES:
      GeneralApi.getResources(resourcesListParam, state.Language, action.state);

      return { ...state, IsEditingResource: action.state };
    case types.SET_TITLE_PAGE:
      return { ...state, Title: action.data };

    // VALIDATE_USER_PAGE
    case types.VALIDATE_USER_PAGE:
      // get civility for the language
      if (state.Civilities[state.Language] == null) {
        GeneralApi.getCivilities(state.Language);
      }

      // get countries
      if (state.Countries[state.Language] == null) {
        GeneralApi.getCountries(state.Language, 'MO');
      }

      // get functions
      if (state.Functions[state.Language] == null) {
        GeneralApi.getFunctions(state.Language);
      }

      // get activities
      if (state.Activities[state.Language] == null) {
        GeneralApi.getActivities(state.Language);
      }

      // get companies size
      if (state.CompaniesSize[state.Language] == null) {
        GeneralApi.getCompaniesSize();
      }

      return state;

    // UPDATE_USER_ACCOUNT
    case types.UPDATE_USER_ACCOUNT:
      // get civility for the language
      if (state.Civilities[state.Language] == null) {
        GeneralApi.getCivilities(state.Language);
      }

      // get countries
      if (state.Countries[state.Language] == null) {
        GeneralApi.getCountries(state.Language, 'MO');
      }

      // get functions
      if (state.Functions[state.Language] == null) {
        GeneralApi.getFunctions(state.Language);
      }

      // get activities
      if (state.Activities[state.Language] == null) {
        GeneralApi.getActivities(state.Language);
      }

      // get companies size
      if (state.CompaniesSize[state.Language] == null) {
        GeneralApi.getCompaniesSize();
      }

      // get details
      if (state.UserDetails == null) {
        GeneralApi.getUserDetails(state.TemporaryToken);
      }

      return state;

    case types.MANAGE_PINS_PAGE:
      // get pins list
      PinsApi.getPinsList(state.ManagementCloudId, state.TemporaryToken);
      break;

    // SET LANGUAGE
    case types.SET_LANGUAGE:
      if (typeof action.language === 'undefined' || state.Languages.length == 0) {
        action.language = 'en';
        action.languageCulture = 'en-US';
      } else {
        action.languageCulture = _.map(state.Languages, (language, i) => {
          if (language.LanguageCode === action.language) {
            return language.LanguageCulture;
          }
        })[0];
      }

      if (
        Utils.LANGUAGE_MANAGED.indexOf(action.language) !== -1 &&
        state.Language !== action.language
      ) {
        Utils.setCookie('language', action.language, 3650);
      }

      if (
        typeof state.Resources[action.language] === 'undefined' &&
        state.Language !== action.language
      ) {
        GeneralApi.getResources(resourcesListParam, action.language, state.IsEditingResource);
      }

      return {
        ...state,
        Language: action.language,
        LanguageCulture: action.languageCulture,
      };

    // SET ROLE
    case types.SET_ROLE:
      if (!action.language || state.Languages.length === 0) {
        action.language = 'en';
        action.languageCulture = 'en-US';
      } else {
        action.languageCulture = _.map(state.Languages, (language, i) => {
          if (language.LanguageCode === action.language) {
            return language.LanguageCulture;
          }
        })[0];
      }

      if (state.Roles[action.language] == null && state.TemporaryToken !== '') {
        // Chargement des rôles
        const onflyId =
          action.onflyId || state.ManagementCloudId || localStorage.getItem('OnflyId');
        GeneralApi.getRoles(action.language, state.TemporaryToken, onflyId);
      }

      return {
        ...state,
      };

    // UPDATE AUTH TOKEN
    case types.UPDATE_AUTH_TOKEN:
      // get Temporary token
      GeneralApi.getTemporaryKey(
        action.data,
        state.ManagementCloudId,
        state.Resources[state.Language]
      );
      return state;
    // UPDATE TEMPORARY TOKEN
    case types.UPDATE_TEMPORARY_TOKEN: {
      // set cookie
      localStorage.setItem('Auth_token', action.data.AuthToken);
      localStorage.setItem('Temporary_token', action.data.Token);

      if (state.Roles[state.Language] == null && state.SubDomain !== 'community') {
        // Chargement des rôles
        GeneralApi.getRoles(state.Language, action.data.Token, state.ManagementCloudId);
      }
      if (state.Softwares.length === 0) {
        GeneralApi.getSoftwares();
      }

      var send = state.SocketStatusSend;

      if (state.SocketStatus === true && !state.SocketStatusSend) {
        QWebChannelUtils.sendMessage({ Category: 'Ready', Action: 'set', Data: true });
        send = true;
      }

      localStorage.setItem('IsAuthenticatedUpload', true);

      return {
        ...state,
        AuthToken: action.data.AuthToken,
        TemporaryToken: action.data.Token,
        UserFirstName: action.data.UserFirstName,
        UserLastName: action.data.UserLastName,
        UserAvatar: action.data.UserAvatar,
        UserId: action.data.UserId,
        RoleId: action.data.RoleId,
        RoleKey: action.data.RoleKey,
        RoleName: action.data.RoleName,
        UserIsAuthenticated: true,
        IsBimAndCoAdmin: action.data.IsBimAndCoAdmin === 'True',
        CookieProcessed: true,
        UserSettings: action.data.Settings,
        SocketStatusSend: send,
        AuthenticationLoading: false,
        AuthenticationSuccess: true,
        AuthenticationError: undefined,
      };
    }
    // LOGOUT
    case types.LOGOUT:
      // remove cookie
      localStorage.setItem('Auth_token', '');
      localStorage.setItem('Code_token', '');
      localStorage.setItem('Temporary_token', '');
      localStorage.setItem('IsAuthenticatedUpload', false);

      return {
        ...state,
        AuthToken: '',
        TemporaryToken: '',
        UserIsAuthenticated: false,
        UserDetails: null,
      };
    // UPDATE ROLES
    case types.UPDATE_ROLES: {
      const roles = state.Roles;
      roles[action.language] = action.data;
      return { ...state, Roles: roles };
    }
    case FETCH_LANGUAGES_SUCCESS:
      return { ...state, Languages: action.Languages };

    case types.UPDATE_SOFTWARES:
      return { ...state, Softwares: action.data };

    case SET_URL:
      return { ...state, Url: action.state };

    case SET_LOADER:
      return { ...state, Loader: action.state };

    case types.SET_DEFAULT_SELECTED_TAB_DETAILS_PAGE:
      return { ...state, DefaultSelectedTabDetailsPage: action.data };

    case types.UPDATE_CIVILITIES:
      return { ...state, Civilities: action.data };

    case types.UPDATE_COUNTRIES:
      return { ...state, Countries: action.data };

    case types.UPDATE_FUNCTIONS:
      return { ...state, Functions: action.data };

    case types.UPDATE_ACTIVITIES:
      return { ...state, Activities: action.data };

    case types.UPDATE_COMPANIES_SIZE:
      return { ...state, CompaniesSize: action.data };

    case types.UPDATE_USER_DETAILS:
      return {
        ...state,
        UserDetails: action.data,
        UserAvatar: action.data.AvatarAdress,
      };

    case FETCH_DOCUMENT_TYPES_SUCCESS:
      return { ...state, DocumentTypes: action.DocumentTypes };

    case types.UPDATE_UNREAD_MESSAGES_COUNT:
      return { ...state, UnreadMessagesCount: action.data };

    case types.RESET_AUTH_TOKEN:
      localStorage.setItem('Auth_token', '');
      localStorage.setItem('Temporary_token', '');
      localStorage.setItem('IsAuthenticatedUpload', false);

      return {
        ...state,
        UserIsAuthenticated: false,
        AuthToken: '',
        UserId: '',
        UserFirstName: '',
        UserlastName: '',
        UserAvatar: '',
        RoleId: '',
        RoleKey: '',
        RoleName: '',
        IsBimAndCoAdmin: false,
        UserDetails: null,
        TemporaryToken: '',
        AuthenticationLoading: false,
      };

    case types.UPDATE_GROUP:
      return { ...state, Group: action.data };

    case types.UPDATE_ACCOUNT_SETTINGS:
      return { ...state, UserSettings: { ...state.UserSettings, ...action.data } };

    case types.SOCKET_STATUS: {
      var send = state.SocketStatusSend;
      let tries = 0;

      if (
        action.data === true &&
        !localStorage.getItem('IsAuthenticatedUpload') &&
        !localStorage.getItem('Temporary_token') &&
        !state.SocketStatusSend
      ) {
        // FIND BETTER SOLUTION
        while (
          !localStorage.getItem('IsAuthenticatedUpload') &&
          !localStorage.getItem('Temporary_token') &&
          tries < 10
        ) {
          Utils.sleep(500);
          tries++;
        }
      }

      if (
        action.data === true &&
        localStorage.getItem('IsAuthenticatedUpload') &&
        localStorage.getItem('Temporary_token') &&
        !state.SocketStatusSend
      ) {
        QWebChannelUtils.sendMessage({ Category: 'Ready', Action: 'set', Data: true });
        send = true;
      } else if (action.data === false) {
        QWebChannelUtils.sendMessage({ Category: 'Ready', Action: 'set', Data: false });
        send = false;
      }

      return {
        ...state,
        SocketStatus: action.data,
        SocketStatusSend: send,
      };
    }
    // UPLOAD
    case 'setBundles': {
      const xmlDocArray = [];
      if (action.data != null && action.data.BundleList != null) {
        for (var i = 0; i < action.data.BundleList.length; i++) {
          xmlDocArray.push(BundleUtils.getXmlDocFromBundle(action.data.BundleList[i]));
        }
        const properties = BundleUtils.getPropertiesFromBundleArray(xmlDocArray);
        const objects = BundleUtils.getObjectsFromBundleArray(xmlDocArray);

        const page = setPage('ChooseMapping', state.Settings, state.SubDomain);
        let bundleToState = action.data.BundleList;
        let uploadInProgressToState = false;

        if (state.SubDomain === 'community' || state.Settings?.EnableDictionary) {
          // let managementcloudId = BundleUtils.getManagementCloudIdFromBundle(xmlDocArray);

          const parameters = {
            Parameters: properties,
            CaoCategories: _.chain(objects)
              .pluck('CaoClassification')
              .uniq()
              .reject((value) => value == null)
              .value(),
            CaoName: window._softwarePlugin !== '' ? window._softwarePlugin : 'revit',
            ConfigurationId: window._uploadMappingConfigurationID,
            ConfigurationLanguage: window._uploadMappingConfigurationLanguage,
            LanguageCode: objects[0].LanguageCode != null ? objects[0].LanguageCode : 'en',
            ContentManagementId: state.ManagementCloudId,
            DictionaryLanguage: window._uploadMappingDictionaryLanguage,
          };

          const queryParams = new URLSearchParams(window.location.search);
          const accessToken = queryParams.get('access_token') || state.TemporaryToken;
          MappingApi.getMappingForUpload(parameters, accessToken);
        } else {
          let xmlDocs = [];
          for (var i = 0; i < action.data.BundleList.length; i++) {
            xmlDocs.push(BundleUtils.getXmlDocFromBundle(action.data.BundleList[i]));
          }

          xmlDocs = BundleUtils.setModelDataToBundle(objects, [], [], true, false, xmlDocs);

          const xmlDocsBundle = [];
          for (var i = 0; i < xmlDocs.length; i++) {
            xmlDocsBundle.push(BundleUtils.getBundleFromXmlDoc(xmlDocs[i]));
          }
          bundleToState = xmlDocsBundle;
          uploadInProgressToState = false;

          // envoi des bundles via la socket
          QWebChannelUtils.sendMessage({
            Category: 'BundleListMapped',
            Action: 'set',
            Data: { BundleList: xmlDocsBundle, Id: action.data.Id },
          });
        }

        return {
          ...state,
          bundle: bundleToState,
          bundleId: action.data.Id,
          mapping: properties,
          mappingConnected: [],
          mappingRev: state.mappingRev + 1,
          objectsList: [...objects],
          variantSelectedCount: objects.length === 1 ? objects[0].Variants.length : 0,
          defaultMappingLoaded: false,
          page,
          uploadInProgress: uploadInProgressToState,
        };
      }
      return state;
    }

    case 'setSummaryUploadList':
      if (action.data != null) {
        // api informations load
        SearchApi.getSummaryUploadInformations(
          action.data,
          state.ManagementCloudId,
          state.TemporaryToken
        );

        // store ids for later calls
        return { ...state, SummaryUploadListIds: action.data };
      }
      return state;

    case 'setSummaryUploadDetailsList':
      if (action.data != null) {
        return { ...state, SummaryUploadDetailsList: action.data };
      }
      return state;

    case 'cleanSummaryUploadList':
      return { ...state, SummaryUploadDetailsList: [] };

    case 'setMappingFromConfiguration':
      if (action.data.PropertiesList != null && action.data.PropertiesConnectedList != null) {
        const connected = state.mappingConnected;
        _.each(action.data.PropertiesConnectedList, (item) => {
          // recherche du domaine
          const index = _.findIndex(connected, (mappingPrev) => mappingPrev.Id === item.Id);

          // si domaine n'existe pas
          if (index === -1) {
            connected.push(item);
          } else {
            connected[index].PropertyList = [
              ...connected[index].PropertyList,
              ...item.PropertyList,
            ];
          }
        });

        return {
          ...state,
          mapping: action.data.PropertiesList,
          mappingConnected: [...connected],
          mappingRev: state.mappingRev + 1,
          defaultMappingLoaded: true,
        };
      }
      return state;

    case 'setMapping':
      return {
        ...state,
        mapping: action.mapping,
        mappingRev: state.mappingRev + 1,
      };

    case 'changePage':
      if (action.page === 'ChooseMappingMulti') {
        const objectsList = addStatsMapping(
          state.objectsList,
          state.mapping,
          state.mappingConnected
        );

        return {
          ...state,
          page: action.page,
          objectsList,
        };
      }
      return { ...state, page: action.page };

    case 'setClassificationToObject': {
      const objectsList = [...state.objectsList];
      _.each(objectsList, (item, i) => {
        setClassificationNode(item, action.selectedObjectId, action.selectedNodes);
      });

      return {
        ...state,
        objectsList,
        objectRev: state.objectRev + 1,
      };
    }

    case 'setTagToObject': {
      const objectsListTag = state.objectsList;
      _.each(objectsListTag, (item, i) => {
        setTag(item, action.selectedObjectId, action.selectedTags);
      });

      return {
        ...state,
        objectsList: objectsListTag,
        objectRev: state.objectRev + 1,
      };
    }

    case 'changeObjectLanguage': {
      const objectsListLanguage = state.objectsList;
      _.each(objectsListLanguage, (item, i) => {
        setLanguage(item, action.language);
      });

      return {
        ...state,
        objectsList: objectsListLanguage,
        objectRev: state.objectRev + 1,
      };
    }

    case 'setModelDataToBundle': {
      let xmlDocs = [];
      for (let i = 0; i < state.bundle.length; i++) {
        xmlDocs.push(BundleUtils.getXmlDocFromBundle(state.bundle[i]));
      }

      xmlDocs = BundleUtils.setModelDataToBundle(
        state.objectsList,
        state.mappingConnected,
        state.selectedGroups,
        action.onflyUpload,
        action.platformUpload,
        xmlDocs
      );

      const xmlDocsBundle = [];
      for (var i = 0; i < xmlDocs.length; i++) {
        xmlDocsBundle.push(BundleUtils.getBundleFromXmlDoc(xmlDocs[i]));
      }

      // envoi des bundles via la socket
      action.callback(xmlDocsBundle, state.bundleId);

      return {
        ...state,
        bundle: xmlDocsBundle,
        uploadInProgress: true,
      };
    }

    case 'connectUploadProperty': {
      const domain = action.propertyConnected.CAD_ParameterGroup;
      const { mappingConnected } = state;
      // recupération du domaine
      let indexDomain = _.findIndex(mappingConnected, (value) => value.Name === domain);

      if (indexDomain === -1) {
        indexDomain = _.findIndex(state.mapping, (value) => value.Name === domain);
        mappingConnected.push({
          Id: state.mapping[indexDomain].Id,
          name: domain,
          PropertyList: [],
        });
        indexDomain = mappingConnected.length - 1;
      }

      // ajout à la liste connecté
      mappingConnected[indexDomain].PropertyList = _.filter(
        mappingConnected[indexDomain].PropertyList,
        (item) =>
          !(
            item.PropertyMappingConnected.CAD_MappingKey ===
              action.propertyConnected.CAD_MappingKey &&
            item.PropertyMappingConnected.CAD_ParameterTypeName ===
              action.propertyConnected.CAD_ParameterTypeName
          )
      );

      mappingConnected[indexDomain].PropertyList.push(
        Object.assign(action.propertyToConnect, {
          PropertyMappingConnected: action.propertyConnected,
        })
      );

      // retirer de la liste à connecter
      const mapping = _.map(state.mapping, (item, i) => {
        item.PropertyList = _.filter(
          item.PropertyList,
          (prop) => prop.Id !== action.propertyConnected.Id
        );
        return item;
      });

      return {
        ...state,
        mapping,
        mappingConnected: [...mappingConnected],
      };
    }

    case 'disconnectUploadProperty': {
      const id = action.propertyConnected.Id;
      // retirer la propriété de la liste des connectées
      const new_mapping_connected = _.map(state.mappingConnected, (item, i) => {
        item.PropertyList = _.filter(
          item.PropertyList,
          (prop) => prop.PropertyMappingConnected.Id !== id
        );
        return item;
      });

      // ajout de la propriété a la liste à connecter
      // recupération du domaine
      const new_mapping = state.mapping;
      let indexDomain2 = _.findIndex(
        new_mapping,
        (value) => value.Name === action.propertyConnected.CAD_ParameterGroup
      );

      if (indexDomain2 === -1) {
        new_mapping.push({
          Id: new_mapping.length,
          Name: action.propertyConnected.CAD_ParameterGroup,
          PropertyList: [],
        });
        indexDomain2 = new_mapping.length - 1;
      }

      new_mapping[indexDomain2].PropertyList.push(action.propertyConnected);

      return {
        ...state,
        mapping: [...new_mapping],
        mappingConnected: [...new_mapping_connected],
      };
    }

    case 'cancelUpload': {
      const page = setPage('ChooseProject', state.Settings, state.SubDomain);
      return {
        ...state,
        page,
        objectsList: [],
        mapping: [],
        mappingConnected: [],
        objectRev: 0,
        variantSelectedCount: 0,
        bundle: [],
        bundleId: null,
        defaultMappingLoaded: false,
        uploadInProgress: false,
        Loader: true,
      };
    }

    case 'processMagicMapping': {
      const parameters = {
        Parameters: state.mapping,
        CaoCategories: _.chain(state.objectsList)
          .pluck('CaoClassification')
          .uniq()
          .reject((value) => value == null)
          .value(),
        CaoName: window._softwarePlugin !== '' ? window._softwarePlugin : 'revit',
        ConfigurationId: window._uploadMappingConfigurationID,
        ConfigurationLanguage: window._uploadMappingConfigurationLanguage,
        LanguageCode:
          state?.objectsList[0]?.LanguageCode != null ? state?.objectsList[0]?.LanguageCode : 'en',
        ContentManagementId: state.ManagementCloudId,
        ForceAutoMapping: true,
        DictionaryLanguage: window._uploadMappingDictionaryLanguage,
      };

      MappingApi.getMappingForUpload(parameters, state.TemporaryToken);

      return { ...state, defaultMappingLoaded: false };
    }

    case GET_USER_INFO_SUCCESS:
      OCAnalytics.user({
        id: action.userInfo.Id,
        email: action.userInfo.Email,
        firstName: action.userInfo.FirstName,
        lastName: action.userInfo.LastName,
        function: action.userInfo.Function?.DefaultValue,
        company: action.userInfo.CompanyName,
        activitySector: action.userInfo.ActivityGroup?.DefaultValue,
      });

      OCAnalytics.properties({ role: action.userInfo?.Role?.Key });

      return {
        ...state,
        UserFirstName: action.userInfo.FirstName,
        UserLastName: action.userInfo.LastName,
        UserAvatar: action.userInfo.Avatar,
        UserId: action.userInfo.Id,
        UserJob: action.userInfo.Function,
        UserCity: action.userInfo.City,
        UserEmail: action.userInfo.Email,
        RoleId: action.userInfo.Role?.Id,
        RoleKey: action.userInfo.Role?.Key,
        RoleName: action.userInfo.Role?.Name,
        IsBimAndCoAdmin: action.userInfo.IsBimandCoAdmin,
        CookieProcessed: true,
        AuthenticationLoading: false,
        AuthenticationSuccess: true,
        AuthenticationError: undefined,
        UserIsAuthenticated: true,
      };
    case GET_USER_INFO_ERROR:
      return {
        ...state,
        AuthenticationLoading: false,
        AuthenticationSuccess: false,
        AuthenticationError: action.error,
      };
    case CHECK_AUTHENTICATION:
      return {
        ...state,
        AuthenticationLoading: true,
        AuthenticationSuccess: false,
        AuthenticationError: undefined,
      };
    case CHECK_AUTHENTICATION_ERROR:
      return {
        ...state,
        AuthenticationLoading: false,
        AuthenticationSuccess: false,
        AuthenticationError: action.error,
        UserIsAuthenticated: false,
      };
    case SET_TOKEN:
      return { ...state, TemporaryToken: action.token };
    case SET_PERMANENT_TOKEN:
      return { ...state, PermanentToken: action.token };

    default:
      return state;
  }
  return state;
};

export default appReducer;

function addStatsMapping(objectList, mapping, mappingConnected) {
  const propertiesFlat = _.chain(mapping).pluck('PropertyList').flatten().value();
  const mappingFlat = _.chain(mappingConnected)
    .pluck('PropertyList')
    .flatten()
    .pluck('PropertyMappingConnected')
    .flatten()
    .value();

  return _.map(objectList, (object) => {
    object.TotalPropsCount = 0;
    object.PropsMappedCount = 0;

    // parcours des propriétés non mappées
    _.each(propertiesFlat, (property) => {
      if (_.indexOf(_.pluck(property.CAD_Objects, 'CaoObjectId'), object.CaoObjectId) !== -1) {
        object.TotalPropsCount++;
      }
    });

    // parcours des propriétés mappées
    _.each(mappingFlat, (property) => {
      if (_.indexOf(_.pluck(property.CAD_Objects, 'CaoObjectId'), object.CaoObjectId) !== -1) {
        object.PropsMappedCount++;
        object.TotalPropsCount++;
      }
    });

    return object;
  });
}

function setLanguage(item, language) {
  if (item.CaoObjectId != null) {
    item.LanguageCode = language;
  }

  if (item.Nodes != null) {
    _.each(item.Nodes, (itemSub, i) => {
      setLanguage(itemSub, language);
    });
  }
}

function setPage(intialPage, dataSettings, subDomain) {
  let page = intialPage;
  if (dataSettings != 'undefined' && dataSettings != null) {
    if (!dataSettings.EnableDictionary && subDomain !== 'community') {
      page = 'ChooseMappingMulti';
    }
  }
  return page;
}
