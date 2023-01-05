import toastr from 'toastr';
import store from '../Store/Store';
import { API_URL } from './constants';

export function addBimObjects(managementcloudId, bimobjectsList, token, resources = null) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobject/add?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ BimObjectId: bimobjectsList }),
    }
  ).then((response) => {
    if (response.status == 200) {
      if (resources != null) {
        toastr.success(resources.ContentManagement.AddObjectSuccess);
      }
    } else if (resources != null) {
      toastr.error(resources.ContentManagement.AddObjectFail);
    }
  });
}

export function removeBimObjects(
  managementcloudId,
  bimobjectsList,
  token,
  userId,
  resources = null
) {
  store.dispatch({ type: 'LOADER', state: true });

  const objects = [];
  for (let i = 0; i < bimobjectsList.length; i++) {
    const value = bimobjectsList[i];
    objects.push({ BimobjectId: value, Status: 'deleted' });
  }

  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobject/addorupdate?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objects),
    }
  ).then((response) => {
    store.dispatch({ type: 'LOADER', state: false });
    if (response.status == 200) {
      if (resources != null) {
        toastr.success(resources.ContentManagement.RemoveObjectSuccess);
      }
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS_MANAGE',
        objectIds: bimobjectsList,
        userId,
        actionType: 'deleted',
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS',
        objectIds: bimobjectsList,
        userId,
        actionType: 'deleted',
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS_GROUP',
        objectIds: bimobjectsList,
        userId,
        actionType: 'deleted',
      });
    } else if (resources != null) {
      toastr.error(resources.ContentManagement.RemoveObjectFail);
    }
  });
}

export function unpublishBimObjects(managementcloudId, bimobjectId, token, resources = null) {
  store.dispatch({ type: 'LOADER', state: true });
  const objects = [];
  for (let i = 0; i < bimobjectId.length; i++) {
    const value = bimobjectId[i];
    objects.push({ BimobjectId: value, Status: 'hidden' });
  }

  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobject/addorupdate?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objects),
    }
  ).then((response) => {
    store.dispatch({ type: 'LOADER', state: false });
    if (response.status == 200) {
      if (resources != null) {
        toastr.success(resources.ContentManagement.UnpublishObjectSuccess);
      }
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS_MANAGE',
        objectIds: bimobjectId,
        actionType: 'hidden',
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS',
        objectIds: bimobjectId,
        actionType: 'hidden',
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS_GROUP',
        objectIds: bimobjectId,
        actionType: 'hidden',
      });
    } else if (resources != null) {
      toastr.error(resources.ContentManagement.UnpublishObjectFail);
    }
  });
}

export function publishBimObjects(managementcloudId, bimobjectId, token, resources = null) {
  store.dispatch({ type: 'LOADER', state: true });
  const objects = [];
  for (let i = 0; i < bimobjectId.length; i++) {
    const value = bimobjectId[i];
    objects.push({ BimobjectId: value, Status: 'published' });
  }

  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobject/addorupdate?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objects),
    }
  ).then((response) => {
    store.dispatch({ type: 'LOADER', state: false });
    if (response.status == 200) {
      if (resources != null) {
        toastr.success(resources.SearchResults.PublishObjectSuccess);
      }
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS_MANAGE',
        objectIds: bimobjectId,
        actionType: 'published',
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS',
        objectIds: bimobjectId,
        actionType: 'published',
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_RESULTS_GROUP',
        objectIds: bimobjectId,
        actionType: 'published',
      });
    } else if (resources != null) {
      toastr.error(resources.ContentManagement.UnpublishObjectFail);
    }
  });
}

export function duplicateBimObjects(
  managementcloudId,
  bimobjectId,
  token,
  language,
  resources = null,
  callback = null
) {
  store.dispatch({ type: 'LOADER', state: true });
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobject/${bimobjectId}/duplicate/${language}?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      if (response.status == 200) {
        if (resources != null) {
          toastr.success(resources.SearchResults.DuplicateObjectSuccess);
          return response.clone().json();
        }
      } else if (resources != null) {
        toastr.error(resources.SearchResults.DuplcateObjectFailed);
      }
    })
    .then((json) => {
      if (json != null && callback != null) {
        callback(json);
      }
    });
}
