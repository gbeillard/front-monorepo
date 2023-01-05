import { API_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';
import { CollectionBimObject, CollectionWrite } from './types';

const list = (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/collections`;

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

const create = (languageCode: string, onflyId: number, collection: CollectionWrite) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/collections`;

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(collection),
  };

  return request(url, options);
};

const update = (languageCode: string, onflyId: number, collection: CollectionWrite) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/collections/${collection?.Id}`;

  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(collection),
  };

  return request(url, options);
};

const deleteCollection = (languageCode: string, onflyId: number, collectionId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/collections/${collectionId}`;

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

const get = (languageCode: string, onflyId: number, collectionId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/collections/${collectionId}`;
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

const updateBimObjects = (
  languageCode: string,
  onflyId: number,
  bimObjects: CollectionBimObject[]
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/collections/favorite/bimobjects`;

  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify(bimObjects),
  };

  return request(url, options);
};

export default {
  list,
  create,
  update,
  deleteCollection,
  get,
  updateBimObjects,
};