import { API_URL } from '../../../Api/constants';
import { generateRequest, parseJSON, request, RequestOptions } from '../../../Api/utils';
import { Subset } from '../Subsets/types';
import { Property } from './types';

const getList = (languageCode: string, onflyId: number, setId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/properties`;
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

/**
 * @deprecated
 * @param languageCode
 * @param onflyId
 */
const getAllList = (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/properties`;
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

const addProperties = (onflyId: number, setId: number, properties: Property[]) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/properties`;

  const propertiesToAdd = {
    Properties: properties?.map((property) => property?.Id),
  };

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(propertiesToAdd),
  };

  return request(url, options);
};

const updateSubsets = async (
  languageCode: string,
  onflyId: number,
  setId: number,
  propertyId: number,
  subsets: Subset[],
  keepPropertiesWithValue?: boolean
) => {
  let url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/properties/${propertyId}/subsets`;

  if (keepPropertiesWithValue != null) {
    url = `${url}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  }

  const propertySubsets = subsets?.map((subset) => ({
    Id: subset?.Id,
  }));

  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(propertySubsets),
  };

  const response = await generateRequest(url, options);
  const responseParsed = await parseJSON(response);

  if (response?.status < 200 || response?.status >= 300) {
    let message;

    if (response?.status === 404) {
      message = responseParsed;
    }

    throw new Error(message);
  }

  return responseParsed;
};

const deleteProperties = (
  languageCode: string,
  onflyId: number,
  setId: number,
  properties: Property[],
  keepPropertiesWithValue?: boolean
) => {
  let url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}/properties`;

  if (keepPropertiesWithValue != null) {
    url = `${url}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  }

  const propertiesToDelete = {
    Properties: properties?.map((property) => property?.Id),
  };

  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(propertiesToDelete),
  };

  return request(url, options);
};

export default {
  getList,
  addProperties,
  getAllList,
  updateSubsets,
  deleteProperties,
};