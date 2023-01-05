import toastr from 'toastr';
import { API_URL } from './constants';
import store from '../Store/Store';

const APIKEY = localStorage.getItem('ApiKey');

export const SwitchNotif = async (token, onflyId, type, content) => {
  const response = await fetch(
    `${API_URL}/api/v10/onfly/${onflyId}/notifications/preferences/${type}?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Api-Key': APIKEY,
      },
      body: JSON.stringify(content),
    }
  );
  if (response.status === 200) {
    return response;
  }
  // toastr.error(resources.UserAccount.NoAuthorize);
  console.log('erreur switch notif');
  return Promise.reject();
};

export const GetNotif = async (token, onflyId) => {
  store.dispatch({ type: 'LOADER', state: true });
  const response = await fetch(
    `${API_URL}/api/v10/onfly/${onflyId}/notifications/preferences?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Api-Key': APIKEY,
      },
    }
  );
  store.dispatch({ type: 'LOADER', state: false });
  if (response.status === 200) {
    return response.json();
  }
  // toastr.error(resources.UserAccount.NoAuthorize);
  console.log('erreur get notif');
  return Promise.reject();
};
