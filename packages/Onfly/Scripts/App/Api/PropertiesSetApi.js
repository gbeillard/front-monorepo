/* eslint-disable @typescript-eslint/no-unsafe-argument */

import toastr from 'toastr';
import { API_URL } from './constants';

const APIKEY = localStorage.getItem('ApiKey');

const sendRequest = async (url, method, requestBody, token) =>
  fetch(url, {
    method,
    body: requestBody,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Api-Key': APIKEY,
    },
  });

/**
 * API call for listing properties sets
 * @param {*} onflyId
 * @param {*} token
 * @param {*} resources
 */
export const getPropertiesSets = async (onflyId, token, resources) => {
  const response = await sendRequest(
    `${API_URL}/api/v10/onfly/${onflyId}/sets`,
    'GET',
    null,
    token
  );
  if (response.status === 200) {
    return response.json();
  }

  toastr.error(resources.ContentManagementPropSetForm.APIListError);
  return Promise.reject();
};

/**
 * API call for finding a property set
 * @param {*} onflyId
 * @param {*} token
 * @param {*} resources
 */
export const getPropertySet = async (setId, onflyId, token, resources) => {
  const response = await sendRequest(
    `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}`,
    'GET',
    null,
    token
  );
  if (response.status === 200) {
    return response.json();
  }

  toastr.error(resources.ContentManagementPropSetForm.APIListError);
  return Promise.reject();
};

/**
 * API call for deleting a property set
 * @param {*} onflyId
 * @param {*} token
 * @param {*} resources
 */
export const deletePropertySet = async (
  setId,
  keepPropertiesWithValue,
  onflyId,
  token,
  resources
) => {
  let deleteSetUrl = `${API_URL}/api/v10/onfly/${onflyId}/sets/${setId}`;

  if (!keepPropertiesWithValue) {
    deleteSetUrl += '?keepPropertiesWithValue=false';
  }

  const response = await sendRequest(deleteSetUrl, 'DELETE', null, token);
  if (response.status === 200) {
    return response.json();
  }

  toastr.error(resources.ContentManagementPropSetForm.APIDeleteError);
  return Promise.reject();
};

/**
 * API call for creating a set and its subsets
 * @param {*} onflyId
 * @param {*} token
 * @param {*} resources
 * @param {*} param3
 */
export const createEditPropertySet = async (
  onflyId,
  token,
  resources,
  { name, description, subsets, keepPropertiesWithValue = true },
  propertySet
) => {
  const setBody = JSON.stringify({
    Name: name,
    Description: description,
  });

  const urlSet = propertySet
    ? `${API_URL}/api/v10/onfly/${onflyId}/sets/${propertySet.Id}`
    : `${API_URL}/api/v10/onfly/${onflyId}/sets`;

  // Create/Update Set
  return sendRequest(urlSet, propertySet ? 'PUT' : 'POST', setBody, token)
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(propertySet || response.json());
      }

      toastr.error(resources.ContentManagementPropSetForm.APICreateSetError);
      return Promise.reject();
    })
    .then((propSet) => {
      if (propSet?.Id) {
        // If create with no subsets
        if (propertySet == null && (subsets || []).length === 0) {
          return Promise.resolve(propSet);
        }

        const subsetBody = JSON.stringify(
          (subsets || []).map((subset) => ({ Name: subset.value }))
        );

        let subsetsUrl = `${API_URL}/api/v10/onfly/${onflyId}/sets/${propSet.Id}/subsets`;

        if (!keepPropertiesWithValue) {
          subsetsUrl += '?keepPropertiesWithValue=false';
        }

        // Create/Update Subsets
        return sendRequest(subsetsUrl, 'PUT', subsetBody, token).then((response) => {
          if (response.status === 200) {
            return response.json();
          }

          toastr.error(resources.ContentManagementPropSetForm.APICreateSubsetError);
          return Promise.reject();
        });
      }
      toastr.error(resources.ContentManagementPropSetForm.APICreateSetError);
      return Promise.reject();
    });
};

/**
 * Request properties bundle for BACEngine
 * @param {*} bundleRequest request data
 * @param {*} token request token
 * @param {*} resources translation text
 */
export const getPropertiesSetBundle = async (bundleRequest, token, resources) => {
  const paramBundle = JSON.stringify(bundleRequest);
  return fetch(`${API_URL}/api/ws/v4/download/bundle`, {
    method: 'POST',
    headers: {
      Accept: 'application/xml',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Api-Key': APIKEY,
    },
    body: paramBundle,
  }).then((response) => {
    if (response.status !== 200) {
      toastr.error(resources.BimObjectDetails.DownloadFail);
      return null;
    }
    return response.text();
  });
};
