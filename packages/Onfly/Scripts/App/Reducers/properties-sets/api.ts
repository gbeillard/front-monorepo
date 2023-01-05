import { API_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';

const get = (languageCode: string, onflyId: number, setId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}`;
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

const list = (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/sets`;
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

export default {
  get,
  list,
};