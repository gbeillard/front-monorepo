import { API_URL } from '../../../Api/constants';
import { request, RequestOptions } from '../../../Api/utils';
import { LanguageCode } from '../../app/types';
import { NodeProperty } from './types';
import { getSourceSubset } from './utils';

const getBaseUrl = (onflyId: number, classificationId: number, nodeId: number): string =>
  `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}`;

const fetchProperties = (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  nodeId: number
): Promise<NodeProperty[]> => {
  const url = `${getBaseUrl(onflyId, classificationId, nodeId)}/properties`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

const addProperties = (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  nodeId: number,
  properties: NodeProperty[]
) => {
  const url = `${getBaseUrl(onflyId, classificationId, nodeId)}/properties`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify(properties),
  };

  return request(url, options);
};

const updateProperty = (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  nodeId: number,
  property: NodeProperty
) => {
  const baseUrl = getBaseUrl(onflyId, classificationId, nodeId);
  const sourceSubset = getSourceSubset(property);
  const url = sourceSubset
    ? `${baseUrl}/subsets/${sourceSubset.Id}/properties/${property.Id}`
    : `${baseUrl}/properties/${property.Id}`;
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify(property),
  };

  return request(url, options);
};

const deleteProperty = (
  onflyId: number,
  classificationId: number,
  nodeId: number,
  property: NodeProperty,
  keepPropertiesWithValue: boolean
) => {
  const url = `${getBaseUrl(onflyId, classificationId, nodeId)}/properties/${property.Id
    }?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

export default {
  fetchProperties,
  addProperties,
  updateProperty,
  deleteProperty,
};