import { generateRequest, parseJSON, request, RequestOptions } from '../../Api/utils';
import { API_URL } from '../../Api/constants';

import { SpaceWrite } from './types';
import { User } from '../app/types';

const list = (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/spaces`;

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

const deleteSpace = (languageCode: string, onflyId: number, spaceId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/space/${spaceId}`;

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

const create = async (languageCode: string, onflyId: number, space: SpaceWrite) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/space`;

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(space),
  };

  const response = await parseJSON(await generateRequest(url, options));

  const { Id } = response;

  // La cr�ation de l'espace � �chou�e
  if (!Id) {
    throw new Error(response);
  }

  return response;
};

const updateSpace = (languageCode: string, onflyId: number, space: SpaceWrite) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/space/${space?.Id}`;

  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(space),
  };

  return request(url, options);
};

const askAuthorization = (languageCode: string, spaceId: number, user: User) => {
  const url = `${API_URL}/api/ws/v1/user/onflyaccessrequest/send`;

  const body = {
    OnflyId: spaceId,
    UserFirstName: user.firstName,
    UserLastName: user.lastName,
    UserEmail: user.email,
    RequestCity: user.city ?? '',
    UserJob: user.job?.DefaultValue ?? '',
  };

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(body),
  };

  return request(url, options);
};

export default {
  create,
  list,
  deleteSpace,
  updateSpace,
  askAuthorization,
};