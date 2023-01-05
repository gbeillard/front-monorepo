import { API_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';
import { Preferences } from './types';

const get = (onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

const update = (onflyId: number, preferences: Preferences) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/settings`;
  const options: RequestOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  };

  return request(url, options);
};

export default {
  get,
  update,
};
