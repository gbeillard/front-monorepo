import { API_URL } from '../../../Api/constants';
import { DocumentWrite, DocumentRead, DocumentSubsets } from './types';
import { ObjectVariant } from '../Variants/types';

const APIKEY = localStorage.getItem('ApiKey');

const get = async (languageCode: string, token: string, bimObjectId: number) => {
  const url = `${API_URL}/api/v10/bimobjects/${bimObjectId}/documents?token=${token}`;

  const options = {
    method: 'GET',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, options);
  return response.json();
};

const getFormattedVariants = (variants: ObjectVariant[]) => {
  if (variants === null) {
    return '';
  }
  return variants.map((variant) => variant.Id).join(',');
};

const getFormattedSubsets = (subsets: DocumentSubsets[]) => {
  if (subsets === null) {
    return '';
  }
  return subsets.map((subset) => subset.Id).join(',');
};

const getBody = (document: DocumentWrite): FormData => {
  const data = new FormData();
  document.File && data.append('File', document.File);
  document.Name && data.append('Name', document.Name);
  document.Type && document.Type.Id && data.append('Type', document.Type.Id.toString());
  document.LanguageCode && data.append('LanguageCode', document.LanguageCode);
  document.Variants !== undefined &&
    data.append('Variants', getFormattedVariants(document.Variants));
  document.Subsets !== undefined && data.append('Subsets', getFormattedSubsets(document.Subsets));

  return data;
};

// external files =>

const postUrl = (
  languageCode: string,
  token: string,
  document: DocumentWrite,
  bimObjectId: number,
  onflyId: number
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimobjects/${bimObjectId}/documents/external`;
  const body = JSON.stringify(document);
  const options = {
    method: 'POST',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  };

  return fetch(url, options);
};

const putUrl = (
  languageCode: string,
  token: string,
  document: DocumentWrite,
  bimObjectId: number,
  onflyId: number
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimobjects/${bimObjectId}/documents/${document.Id}/external`;
  const body = JSON.stringify(document);
  const options = {
    method: 'PUT',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  };

  return fetch(url, options);
};

const deleteUrl = (
  languageCode: string,
  token: string,
  document: DocumentRead,
  bimObjectId: number
) => {
  const url = `${API_URL}/api/v10/bimobjects/${bimObjectId}/documents/${document.Id}/external`;
  const options = {
    method: 'DELETE',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, options);
};

// internal files =>

const postFile = (
  languageCode: string,
  token: string,
  document: DocumentWrite,
  bimObjectId: number,
  onflyId: number
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimobjects/${bimObjectId}/documents/internal`;
  const body = getBody(document);
  const options = {
    method: 'POST',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
    },
    body,
  };

  return fetch(url, options);
};

const putFile = (
  languageCode: string,
  token: string,
  document: DocumentWrite,
  bimObjectId: number,
  onflyId: number
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimobjects/${bimObjectId}/documents/${document.Id}/internal`;
  const body = getBody(document);
  const options = {
    method: 'PUT',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
    },
    body,
  };

  return fetch(url, options);
};

const deleteFile = (
  languageCode: string,
  token: string,
  document: DocumentRead,
  bimObjectId: number
) => {
  const url = `${API_URL}/api/v10/bimobjects/${bimObjectId}/documents/${document.Id}/internal`;
  const options = {
    method: 'DELETE',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, options);
};

const API = {
  get,
  putFile,
  putUrl,
  postFile,
  postUrl,
  deleteFile,
  deleteUrl,
};

export default API;