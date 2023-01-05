import toastr from 'toastr';
import store from '../Store/Store';
import { API_URL } from './constants';

export function getUsers(
  contentmanagementId,
  token,
  keyword = '',
  size = 20,
  page = 1,
  addToDocData = false
) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementId}/users/list?search=${keyword}&token=${token}&size=${size}&page=${page}`,
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
      const action = { data: json, type: 'UPDATE_USERS_LIST', addToDocData };
      store.dispatch(action);
    });
}

export function addUsers(contentmanagementId, usersList, token) {
  fetch(`${API_URL}/api/ws/v1/contentmanagement/${contentmanagementId}/users/add?token=${token}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usersList),
  }).then((response) => {
    if (response.status == 200) {
      toastr.success('User added with success');
      getUsers(contentmanagementId, token);
    } else {
      toastr.danger('error when adding user');
    }
  });
}

export function changeUsersRole(
  contentmanagementId,
  usersList,
  token,
  keyword = '',
  size = 20,
  page = 1,
  resources = null
) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementId}/users/update?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usersList),
    }
  ).then((response) => {
    if (response.status == 200) {
      if (resources != null) {
        toastr.success(resources.UsersManagement.UserRoleChanged);
      }
      getUsers(contentmanagementId, token, keyword, size, page);
    } else if (resources != null) {
      toastr.danger(resources.UsersManagement.UserRoleError);
    }
  });
}

export function getGroupUsers(
  contentmanagementId,
  groupId,
  token,
  keyword = '',
  size = 20,
  page = 1,
  addToDocData = false
) {
  fetch(
    `${API_URL}/api/ws/v1/contentmanagement/${contentmanagementId}/groups/${groupId}/users/list?search=${keyword}&token=${token}&size=${size}&page=${page}`,
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
      const action = { data: json, type: 'UPDATE_USERS_LIST', addToDocData: false };
      store.dispatch(action);
    });
}
