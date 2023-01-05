import { API_URL } from '../../../../Api/constants';
import { request, RequestOptions } from '../../../../Api/utils';
import { Subset } from '../../../Sets/Subsets/types';
import { NodeProperty } from '../types';
import { getSourceSubset } from '../utils';

const getBaseUrl = (onflyId: number, classificationId: number, nodeId: number): string =>
  `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}`;
const create = (
  onflyId: number,
  classificationId: number,
  nodeId: number,
  property: NodeProperty,
  subset: Subset
) => {
  const baseUrl = getBaseUrl(onflyId, classificationId, nodeId);
  const sourceSubset = getSourceSubset(property);
  const url = sourceSubset
    ? `${baseUrl}/subsets/${sourceSubset.Id}/properties/${property.Id}/subsets`
    : `${baseUrl}/properties/${property.Id}/subsets`;

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

const remove = (
  onflyId: number,
  classificationId: number,
  nodeId: number,
  property: NodeProperty,
  subset: Subset
) => {
  const baseUrl = getBaseUrl(onflyId, classificationId, nodeId);
  const sourceSubset = getSourceSubset(property);
  const url = sourceSubset
    ? `${baseUrl}/subsets/${sourceSubset.Id}/properties/${property.Id}/subsets/${subset.Id}`
    : `${baseUrl}/properties/${property.Id}/subsets/${subset.Id}`;
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