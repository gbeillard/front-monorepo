import toastr from 'toastr';
import store from '../Store/Store';
import { API_URL } from './constants';
import { history } from '../history';

export function getGroups(token, contentmanagementid) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementid}/groups/search?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json.Documents, type: 'UPDATE_GROUPS_LIST' };
      store.dispatch(action);
    });
}

export const getGroupsV2 = async (token, contentManagementId) => {
  const url = `${API_URL}/api/ws/v1/contentmanagement/${contentManagementId}/groups/search?token=${token}`;
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data.Documents;
};

export function getGroupDetails(contentmanagementid, groupId, token, language, resources) {
  fetch(
    `${API_URL}/api/ws/v1/fr/contentmanagement/${contentmanagementid}/group/${groupId}/details?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      }
      toastr.error(resources.BimObjectAccessAuthorizeAttribute.NoAuthorize);
      history.push(`/${language}/groups`);
    })
    .then((groupVM) => {
      if (groupVM != null) {
        store.dispatch({ type: 'UPDATE_GROUP', data: groupVM });
      }
    });
}

export function checkGroupForDelete(contentmanagementid, groupId, token, language, resources) {
  return fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementid}/group/${groupId}/check?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then((response) => {
    if (response.status == 200) {
      return response.json();
    }
    toastr.error(resources.BimObjectAccessAuthorizeAttribute.NoAuthorize);
    history.push(`/${language}/groups`);
    return Promise.reject(resources.BimObjectAccessAuthorizeAttribute.NoAuthorize);
  });
}

export function deleteGroup(contentmanagementid, groupId, token, language, resources) {
  return fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementid}/groups/${groupId}/delete?token=${token}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then((response) => {
    if (response.status == 200) {
      return response.json();
    }
    toastr.error(resources.BimObjectAccessAuthorizeAttribute.NoAuthorize);
    history.push(`/${language}/groups`);
  });
}

export function deleteGroupBimObjects(contentmanagementid, ObjectsIds, token, language, resources) {
  const Objects = ObjectsIds.map((x) => ({
    BimobjectId: x,
    Status: 'deleted',
  }));

  return fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementid}/bimobject/addorupdate?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Objects),
    }
  ).then((response) => {
    if (response.status == 200) {
      return response.json();
    }
    toastr.error(resources.BimObjectAccessAuthorizeAttribute.NoAuthorize);
    history.push(`/${language}/groups`);
  });
}

export function addObjectsToGroup(
  contentmanagementid,
  groupId,
  objectIdList,
  token,
  resources,
  duplicate = false
) {
  store.dispatch({ type: 'LOADER', state: true });

  return fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementid}/group/${groupId}/associateBimObjectList?token=${token}&duplicate=${duplicate}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ObjectsIds: objectIdList,
      }),
    }
  ).then((response) => {
    store.dispatch({
      type: 'REFRESH_REQUEST_MANAGE',
      managementcloudId: contentmanagementid,
      token,
    });
    store.dispatch({ type: 'LOADER', state: false });
    if (response.status === 200) {
      toastr.success(resources.ManageObjects.ObjectGroupAddSuccess);
      return response.json();
    }
    toastr.error(resources.BimObjectAccessAuthorizeAttribute.NoAuthorize);
    return Promise.reject();
  });
}

const groupsAPI = {
  get: getGroupsV2,
};

export default groupsAPI;
