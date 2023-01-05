import {
  SET_LOADER,
  LOGOUT,
  SET_DOCUMENT_TITLE,
  UPDATE_TEMPORARY_TOKEN,
  RESET_AUTH_TOKEN,
  UPDATE_INFORMATIONS_CONTEXT,
  LOG_ERROR,
  SET_CRISP_METADATA,
  FETCH_DOCUMENT_TYPES,
  FETCH_DOCUMENT_TYPES_SUCCESS,
  FETCH_DOCUMENT_TYPES_ERROR,
  FETCH_LANGUAGES,
  FETCH_LANGUAGES_SUCCESS,
  FETCH_LANGUAGES_ERROR,
  SET_URL,
} from './constants';
import { TOGGLE_EDIT_RESOURCES, SET_TITLE_PAGE } from '../../Actions/app-actions';

export const setLoader = (state) => ({
  type: SET_LOADER,
  state,
});

// todo: state should be renamed
export const toggleEditResources = (state) => ({
  type: TOGGLE_EDIT_RESOURCES,
  state,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setDocumentTitle = (title) => ({
  type: SET_DOCUMENT_TITLE,
  title,
});

// todo: rename data to something more meaningful
export const updateTemporaryToken = (data) => ({
  type: UPDATE_TEMPORARY_TOKEN,
  data,
});

// todo: rename data to something more meaningful
export const updateInformationContext = (data) => ({
  type: UPDATE_INFORMATIONS_CONTEXT,
  data,
});

export const resetAuthToken = () => ({
  type: RESET_AUTH_TOKEN,
});

export const logError = (error) => ({
  type: LOG_ERROR,
  error,
});

export const setCrispMetadata = (firstName, lastName, avatar) => ({
  type: SET_CRISP_METADATA,
  firstName,
  lastName,
  avatar,
});

export const fetchDocumentTypes = () => ({
  type: FETCH_DOCUMENT_TYPES,
});

export const fetchDocumentTypesSuccess = (DocumentTypes) => ({
  type: FETCH_DOCUMENT_TYPES_SUCCESS,
  DocumentTypes,
});

export const fetchDocumentTypesError = (error) => ({
  type: FETCH_DOCUMENT_TYPES_ERROR,
  error,
});

export const fetchLanguages = () => ({
  type: FETCH_LANGUAGES,
});

export const fetchLanguagesSuccess = (Languages) => ({
  type: FETCH_LANGUAGES_SUCCESS,
  Languages,
});

export const fetchLanguagesError = (error) => ({
  type: FETCH_LANGUAGES_ERROR,
  error,
});

export const setPageTitle = (data) => ({
  type: SET_TITLE_PAGE,
  data,
});

export const setUrl = (url) => ({
  type: SET_URL,
  url,
});
