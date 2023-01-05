import { API_URL } from '../../../Api/constants';
import { request, RequestOptions } from '../../../Api/utils';
import { Invitations } from './types';

const send = (languageCode: string, onflyId: number, invitations: Invitations[]) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/invitations`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(invitations),
  };

  return request(url, options);
};

const list = (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/invitations`;
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
  send,
  list,
};