import { API_URL } from '../../../Api/constants';
import { request, RequestOptions } from '../../../Api/utils';
import { Subset } from './types';

const list = (languageCode: string, onflyId: number, setId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/subsets`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
  };

  return request(url, options);
};

const listAll = (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/subsets`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
  };

  return request(url, options);
};

const create = (languageCode: string, onflyId: number, setId: number, subsets: Subset[]) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/subsets`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(subsets),
  };

  return request(url, options);
};

const addProperties = (
  languageCode: string,
  onflyId: number,
  setId: number,
  subsetId: number,
  propertyIds: number[]
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/subsets/${subsetId}/properties`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify({
      Properties: propertyIds,
    }),
  };

  return request(url, options);
};

const deleteProperties = (
  languageCode: string,
  onflyId: number,
  setId: number,
  subsetId: number,
  propertyIds: number[],
  keepPropertiesWithValue?: boolean
) => {
  let url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/subsets/${subsetId}/properties`;

  if (keepPropertiesWithValue != null) {
    url = `${url}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  }

  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify({
      Properties: propertyIds,
    }),
  };

  return request(url, options);
};

// object variant subsets =>
const updateSubsetTwoDModelReference = (
  languageCode: string,
  onflyId: number,
  bimObjectId: number,
  modelId: number,
  variantId: number,
  subsetsIds: number[]
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimobjects/${bimObjectId}/twodmodels/${modelId}/variants/${variantId}/subsets`;

  const subsets = [];
  subsetsIds.forEach((item) => {
    subsets.push({ Id: item });
  });

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify({
      Subsets: subsets,
    }),
  };

  return request(url, options);
};

const updateSubsetThreeDModelReference = (
  languageCode: string,
  onflyId: number,
  bimObjectId: number,
  modelId: number,
  variantId: number,
  subsetsIds: number[]
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimobjects/${bimObjectId}/threedmodels/${modelId}/variants/${variantId}/subsets`;

  const subsets = subsetsIds.map((id) => ({ Id: id }));

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify({
      Subsets: subsets,
    }),
  };

  return request(url, options);
};

export default {
  list,
  listAll,
  create,
  addProperties,
  deleteProperties,
  updateSubsetTwoDModelReference,
  updateSubsetThreeDModelReference,
};