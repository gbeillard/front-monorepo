import { API_URL } from '../../../Api/constants';
import { request, RequestOptions } from '../../../Api/utils';

import { Property } from './types';

const get = (languageCode: string, onflyId: number, bimObjectId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/properties`;
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

const deleteProperty = (
  languageCode: string,
  onflyId: number,
  bimObjectId: number,
  propertyId: number
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/properties/${propertyId}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
  };

  return request(url, options);
};

const add = (
  languageCode: string,
  onflyId: number,
  bimObjectId: number,
  properties: Property[]
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/properties`;

  const propertiesToAdd = properties?.map((property) => ({
    Id: property?.Id,
  }));

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(propertiesToAdd),
  };

  return request(url, options);
};

const API = {
  get,
  deleteProperty,
  add,
};

export default API;