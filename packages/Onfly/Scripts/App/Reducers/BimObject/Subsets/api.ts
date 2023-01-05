import { API_URL } from '../../../Api/constants';
import { request, RequestOptions } from '../../../Api/utils';

import { Subset } from '../../Sets/Subsets/types';

const get = (languageCode: string, onflyId: number, bimObjectId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/subsets`;
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

const deleteSubset = (
  onflyId: number,
  bimObjectId: number,
  subsetId: number,
  keepPropertiesWithValue: boolean
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/subsets/${subsetId}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

const add = (languageCode: string, onflyId: number, bimObjectId: number, subsets: Subset[]) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/subsets`;

  const subsetsToAdd = subsets?.map((subset) => ({
    Id: subset?.Id,
  }));

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(subsetsToAdd),
  };

  return request(url, options);
};

const API = {
  get,
  deleteSubset,
  add,
};

export default API;