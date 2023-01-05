import { IClassification, IClassificationNode } from './types';
import { API_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';
import { LanguageCode } from '../app/types';

const get = (language: LanguageCode, onflyId: number, id: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${id}`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

const list = (language: LanguageCode, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

const update = (language: LanguageCode, onflyId: number, classification: IClassification) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classification.Id}`;
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify(classification),
  };

  return request(url, options);
};

const remove = (
  onflyId: number,
  classification: IClassification,
  keepPropertiesWithValue: boolean
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classification.Id}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

const listNodes = (language: LanguageCode, onflyId: number, classificationId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

const addNode = (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  nodeId: number,
  node: IClassificationNode
) => {
  const url =
    nodeId === null
      ? `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/`
      : `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}/children`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify([node]),
  };

  return request(url, options);
};

const moveNode = (
  onflyId: number,
  classificationId: number,
  target: IClassificationNode,
  node: IClassificationNode
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${node.Id}/parent`;
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Id: target?.Id ?? null }),
  };

  return request(url, options);
};

const updateNode = (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  node: IClassificationNode
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${node.Id}`;
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify(node),
  };

  return request(url, options);
};

const deleteNode = (
  onflyId: number,
  classificationId: number,
  node: IClassificationNode,
  keepPropertiesWithValue: boolean
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${node.Id}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

export default {
  get,
  list,
  update,
  remove,
  listNodes,
  addNode,
  updateNode,
  deleteNode,
  moveNode,
};