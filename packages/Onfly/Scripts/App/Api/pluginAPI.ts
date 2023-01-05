import { RequestOptions, requestRaw } from './utils';
import { API_URL } from './constants';

/**
 * This function ensures compatibility with old revit plugin versions
 * @deprecated
 * @param {*} managementCloudId
 * @param {*} language
 * @param {*} token
 */
export const fetchOldPropertiesDomains = (managementCloudId, language, token) =>
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementCloudId}/properties/officialsearch/${language}?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => (response.status === 200 ? response.json() : []))
    .then((propertiesDomainList) => {
      if (Array.isArray(propertiesDomainList)) {
        return propertiesDomainList;
      }
      return null;
    });

/**
 * Request contents bundle for BACEngine
 * @param {*} bundleRequest request data
 * @param {*} bimobjectId bimobject id
 * @param {*} bundleVersion bundle versio
 * @param {*} managementCloudId OnflyId
 */
export const getContentBundle = async (
  bundleRequest,
  bimobjectId,
  bundleVersion,
  managementCloudId
) => {
  const paramBundle = JSON.stringify(bundleRequest);
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/xml',
      'Content-Type': 'application/json',
    },
    body: paramBundle,
  };

  const url = `${API_URL}/api/ws/v${bundleVersion}/onfly/${managementCloudId}/bimobject/${bimobjectId}/download/bundle`;

  return requestRaw(url, options);
};