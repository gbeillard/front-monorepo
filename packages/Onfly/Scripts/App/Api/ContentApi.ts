import { request, RequestOptions } from './utils';
import { API_URL } from './constants';

/**
 * Request contents to download for website
 * @param {*} modelId 2d/3d/document id
 * @param {*} mediaType content type
 * @param {*} managementCloudId OnflyId
 */
export const getContent = async (modelId, mediaType, managementCloudId) => {
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const source = 'SITE';
  // eslint-disable-next-line no-nested-ternary
  const contentType =
    mediaType === '3DMODEL' ? '3dmodels' : mediaType === '2DMODEL' ? '2dmodels' : mediaType === "DOCUMENT" ?  'documents' : 'complements';
  const url = `${API_URL}/api/ws/v2/${contentType}/${modelId}/${source}/${managementCloudId}/download`;

  return request(url, options);
};