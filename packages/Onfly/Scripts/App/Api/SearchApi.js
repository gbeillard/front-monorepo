import _ from 'underscore';
import { createLibrary } from '../React/Search/utils';
import { ContentManagementLibrary } from '../Reducers/BimObject/types';
import store from '../Store/Store';
import { API_URL } from './constants';

export function search(request, contextRequest, managementCloudId, token, addToDocData = false) {
  let final_url = `${API_URL}/api/ws/v1/contentmanagement/${managementCloudId}/search/results?token=${token}`;
  const context = [];

  if (_.indexOf(contextRequest, 'library') !== -1) {
    context.push(createLibrary(ContentManagementLibrary.Onfly));
  }
  if (_.indexOf(contextRequest, 'public') !== -1) {
    context.push(createLibrary(ContentManagementLibrary.Platform));
  }
  if (_.indexOf(contextRequest, 'entity') !== -1) {
    context.push(createLibrary(ContentManagementLibrary.Entity));
  }

  request.ContentManagementLibraries = context;

  if (request.GroupId > 0) {
    final_url = `${API_URL}/api/ws/v1/contentmanagement/${managementCloudId}/group/${request.GroupId}/search/results?token=${token}`;
  }

  fetch(final_url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      return response.json();
    })
    .then((json) => {
      if (request.GroupId > 0) {
        json.type = 'SEARCH_SUCCESS_GROUP';
      } else if (request.IsManage != undefined && request.IsManage == true) {
        json.type = 'MANAGE_SEARCH_SUCCESS';
      } else {
        json.type = 'SEARCH_SUCCESS';
      }
      json.request = request;
      json.addToDocData = addToDocData;
      json.contextRequest = contextRequest;
      store.dispatch(json);
    });
}

export function searchEncrypted(
  request,
  contextRequest,
  managementCloudId,
  token,
  addToDocData = false
) {
  let final_url = `${API_URL}/api/ws/v1/`;
  final_url += `contentmanagement/${managementCloudId}/`;
  final_url += 'search/results/encrypted';
  final_url += `?token=${token}`;
  final_url += `&contentmanagementId=${managementCloudId}`;

  const data = new FormData();
  data.append('RequestModelEncrypted', request);

  fetch(final_url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: data,
  })
    .then((response) => response.json())
    .then((json) => {
      json.type = 'SEARCH_SUCCESS';
      json.request = json.RequestSource;
      json.addToDocData = addToDocData;
      json.contextRequest = contextRequest;
      store.dispatch(json);
      store.dispatch({ type: 'LOADER', state: false });
    });
}

export function searchDoc(
  request,
  contextRequest,
  managementCloudId,
  token,
  directoryId = 0,
  addToDocData = false
) {
  let final_url = `${API_URL}/api/ws/v1/`;

  final_url += `contentmanagement/${managementCloudId}/`;
  final_url += 'search/results';
  final_url += `?token=${token}`;

  fetch(final_url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((json) => {
      json.type = 'SEARCH_DOC_SUCCESS';
      json.request = request;
      json.addToDocData = addToDocData;
      json.contextRequest = contextRequest;
      json.directoryId = directoryId;
      store.dispatch(json);
    });
}

export function getSummaryUploadInformations(currentObjectsList, managementCloudId, token) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementCloudId}/summaryupload/details?token=${token}`,
    {
      method: 'POST',
      body: JSON.stringify({ SummaryUploadIds: currentObjectsList }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'setSummaryUploadDetailsList' };
      store.dispatch(action);
      return json;
    });
}
