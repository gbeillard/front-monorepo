import { API_URL } from '../../../Api/constants';
import { request, RequestOptions } from '../../../Api/utils';
import { LanguageCode } from '../../app/types';
import { Subset } from '../../Sets/Subsets/types';

const list = (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  nodeId: number
): Promise<Subset[]> => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}/subsets`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

const create = (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  nodeId: number,
  subsets: Subset[]
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}/subsets`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify(subsets),
  };

  return request(url, options);
};

const remove = (
  onflyId: number,
  classificationId: number,
  nodeId: number,
  subset: Subset,
  keepPropertiesWithValue: boolean
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}/subsets/${subset.Id}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
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
  list,
  create,
  remove,
};