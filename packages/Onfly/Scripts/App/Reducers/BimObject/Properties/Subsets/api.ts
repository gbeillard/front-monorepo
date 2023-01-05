import { API_URL } from '../../../../Api/constants';
import { request, RequestOptions } from '../../../../Api/utils';
import { Subset } from '../../../Sets/Subsets/types';
import { Property } from '../types';

const create = (onflyId: number, bimObjectId: number, property: Property, subset: Subset) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/properties/${property?.Id}/subsets`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([subset]),
  };

  return request(url, options);
};

const remove = (onflyId: number, bimObjectId: number, property: Property, subset: Subset) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/bimObjects/${bimObjectId}/properties/${property?.Id}/subsets/${subset?.Id}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

export default {
  create,
  remove,
};