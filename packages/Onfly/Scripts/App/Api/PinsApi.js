import toastr from 'toastr';
import store from '../Store/Store';
import { API_URL } from './constants';

export function getPinsList(managementcloudId, token, size = 0, search = '') {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/pin/list?token=${token}&search=${search}&size=${size}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_PINS_LIST' };
      store.dispatch(action);
    });
}

export function addPins(managementcloudId, pinsList, token, resources = null) {
  fetch(`${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/pin/add?token=${token}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pinList: pinsList, objectList: [] }),
  }).then((response) => {
    if (response.status == 200 && resources != null) {
      toastr.success(resources.ContentManagement.AddTagSuccess);
    } else if (resources != null) {
      toastr.error(resources.ContentManagement.AddTagFail);
    }

    getPinsList(managementcloudId, token, 0);
  });
}

export function removePins(managementcloudId, pinsIdsList, token, resources = null) {
  fetch(`${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/pin/remove?token=${token}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pinsIdsList),
  }).then((response) => {
    if (response.status == 200 && resources != null) {
      toastr.success(resources.ContentManagement.RemoveTagSuccess);
    } else if (resources != null) {
      toastr.error(resources.ContentManagement.RemoveTagFail);
    }

    getPinsList(managementcloudId, token, 0);
  });
}

export function addPinsToBimObjects(
  managementcloudId,
  pinsIdsList,
  bimObjectIdsList,
  token,
  updateRequest = false,
  callback = null,
  resources = null
) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobjects/pin/add?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objectsList: bimObjectIdsList, pinsList: pinsIdsList }),
    }
  )
    .then((response) => response.json())
    .then((json) => {
      if (updateRequest == true) {
        var action = { type: 'REFRESH_REQUEST', managementcloudId, token };
        store.dispatch(action);

        var action = { type: 'REFRESH_REQUEST_GROUP', managementcloudId, token };
        store.dispatch(action);
      }
      if (callback != null) {
        callback();
      }

      if (resources != null) {
        toastr.success(resources.ContentManagement.AddTagSuccess);
      }
    });
}

export function removePinsFromBimObjects(
  managementcloudId,
  pinsIdsList,
  bimObjectIdsList,
  token,
  updateRequest = false,
  callback = null,
  resources = null
) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobjects/pin/remove?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objectsList: bimObjectIdsList, pinsList: pinsIdsList }),
    }
  )
    .then((response) => response.json())
    .then((json) => {
      if (updateRequest == true) {
        var action = { type: 'REFRESH_REQUEST', managementcloudId, token };
        store.dispatch(action);

        var action = { type: 'REFRESH_REQUEST_GROUP', managementcloudId, token };
        store.dispatch(action);
      }
      if (callback != null) {
        callback();
      }

      if (resources != null) {
        toastr.success(resources.ContentManagement.RemoveTagSuccess);
      }
    });
}

export function loadBimObjectPins(managementcloudId, bimObjectId, token, callback = null) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${managementcloudId}/bimobject/${bimObjectId}/pin/list?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      if (callback != null) {
        callback(json);
      }
    });
}
