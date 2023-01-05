/* eslint-disable no-return-await */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */

import toastr from 'toastr';
import store from '../Store/Store';
import { API_URL } from './constants';
import { requestExcel } from './utils';

const APIKEY = localStorage.getItem('ApiKey');

export function getClassificationsList(token, contentManagementId, language, subDomain) {
  let url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/classification/list/${language}?token=${token}`;
  if (subDomain === 'community') {
    url = `${API_URL}/api/ws/v1/classification/list/${language}?token=${token}`;
  }

  fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      store.dispatch({ type: 'UPDATE_CLASSIFICATIONS_LIST', data: json, language });
    });
}

export const getClassificationsListV2 = async (token, contentManagementId, language, subDomain) => {
  const url =
    subDomain === 'community'
      ? `${API_URL}/api/ws/v1/classification/list/${language}?token=${token}&stats=true`
      : `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/classification/list/${language}?token=${token}&stats=true`;

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, options);
  return response.json();
};

export function getClassificationNodesList(token, contentManagementId, language) {
  fetch(`${API_URL}/api/ws/v1/classification/${contentManagementId}/${language}?token=${token}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      store.dispatch({
        type: 'UPDATE_CLASSIFICATION_NODES',
        data: json,
        classificationId: contentManagementId,
        language,
      });
    });
}

export const fetchNodes = async (token, classificationId, languageCode) => {
  const url = `${API_URL}/api/ws/v1/classification/${classificationId}/${languageCode}?token=${token}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(url, options);
  return response.json();
};

export function setClassificationNodeForObjectList(
  token,
  contentManagementId,
  list,
  resources = null
) {
  fetch(
    `${API_URL}/api/ws/v1/bimobjects/classification/node/add?token=${token}&contentmanagementId=${contentManagementId}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    }
  ).then((response) => {
    store.dispatch({ type: 'LOADER', state: false });
    if (response.status === 200) {
      if (resources != null) {
        toastr.success(resources.ContentManagement.ClassificationNodeAddedSuccess);
      }
      store.dispatch({
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: contentManagementId,
        token,
      });
    }
  });
}

export const setClassificationVisibility = async (
  token,
  contentManagementId,
  { Classification, IsEnabled }
) => {
  const url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/manageclassification/${Classification}/link/${IsEnabled}?token=${token}`;
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, options); // no json to read
};

export const saveClassification = async (
  token,
  contentManagementId,
  {
    ClassificationId = 0,
    Name,
    Version,
    Description,
    LanguageCode,
    Template = null,
    PropertyName = null,
    PropertyCode = null,
  }
) => {
  const url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/classification/addorupdate?token=${token}`;
  const PropertyNameId = PropertyName && PropertyName.Id ? PropertyName.Id : null;
  const PropertyCodeId = PropertyCode && PropertyCode.Id ? PropertyCode.Id : null;
  const body = JSON.stringify({
    Name,
    Version,
    Description,
    LanguageCode,
    ClassificationId,
    PropertyNameId,
    PropertyCodeId,
  });
  const options = {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, options);

  if (response.status !== 200) {
    toastr.error('Something went wrong');
    return;
  }

  const newID = await response.json();
  if (!Template) {
    return newID;
  }

  return uploadTemplate(token, contentManagementId, newID, LanguageCode, Template);
};

export const uploadTemplate = async (
  token,
  contentManagementId,
  classificationId,
  languageCode,
  file
) => {
  // const url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/classification/${classificationId}/import/${languageCode}/excel?token=${token}`;
  const url = `${API_URL}/api/v10/onfly/${contentManagementId}/classification/${classificationId}/import/excel`;
  const body = new FormData();
  body.append('file', file);

  const options = {
    method: 'POST',
    headers: {
      'Api-Key': APIKEY,
      'Accept-Language': languageCode,
      Authorization: `Bearer ${token}`,
    },
    body,
  };

  const response = await fetch(url, options);

  if (response.status !== 200) {
    const text = await response.text();
    const message = JSON.parse(text);
    toastr.error(message);
    return classificationId;
  }

  return classificationId;
};

export const cloneClassification = async (
  token,
  contentManagementId,
  { Name, Description, LanguageCode, CopyFrom }
) => {
  store.dispatch({ type: 'LOADER', state: true });
  const url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/classification/clone?token=${token}`;
  const body = JSON.stringify({
    Name,
    Description,
    LanguageCode,
    CopyFrom,
    ClassificationId: 0,
  });
  const options = {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(url, options);

  store.dispatch({ type: 'LOADER', state: false });

  return response.json();
};

export const downloadClassificationTemplate = (
  token,
  contentManagementId,
  language,
  classificationId = 0
) => {
  const url = `${API_URL}/api/v10/classifications/template/excel`;

  const options = {
    method: 'GET',
    headers: {
      'Accept-Language': language,
    },
  };

  return requestExcel(url, options);
};

export const getExcelClassification = (onflyId, languageCode, classificationId = 0) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classification/${classificationId}/export/excel`;

  const options = {
    method: 'GET',
    headers: {
      'Accept-Language': languageCode,
    },
  };

  return requestExcel(url, options);
};

export const deleteClassification = async (token, contentManagementId, classificationId) => {
  const url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/classification/delete/${classificationId}?token=${token}`;
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, options);
};

export const fetchClassification = async (
  token,
  contentManagementId,
  classificationId,
  languageCode
) => {
  const url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/classification/${classificationId}/${languageCode}?token=${token}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, options);
  return response.json();
};

export const updateClassificationNode = async (
  onflyId,
  token,
  classificationId,
  nodeId,
  property
) => {
  const { Id, IsMandatoryGeneric, IsMandatoryOfficial } = property;
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}/ChangeMandatoryProperty`;
  const body = JSON.stringify({
    PropertyId: Id,
    IsMandatoryGeneric,
    IsMandatoryOfficial,
  });
  const options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  };
  return fetch(url, options);
};

const updateMandatory = (token, onflyId, classificationId, isMandatory) => {
  const url = `${API_URL}/api/ws/v1/contentmanagement/${onflyId}/manageclassification/${classificationId}/mandatory/${isMandatory}?token=${token}`;
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  return fetch(url, options);
};

const API = {
  getClassificationsList,
  getClassificationsListV2,
  getClassificationNodesList,
  setClassificationNodeForObjectList,
  setClassificationVisibility,
  saveClassification,
  cloneClassification,
  downloadClassificationTemplate,
  deleteClassification,
  fetchClassification,
  updateClassificationNode,
  fetchNodes,
  updateMandatory,
  getExcelClassification,
};

export default API;
