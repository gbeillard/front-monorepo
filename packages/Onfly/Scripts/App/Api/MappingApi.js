import toastr from 'toastr';
import store from '../Store/Store';
import { API_URL } from './constants';

export function getMappingForUpload(data, token) {
  fetch(`${API_URL}/api/ws/v1/plugin/properties-mapping/search-for-upload?token=${token}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'setMappingFromConfiguration' };
      store.dispatch(action);
    })
    .catch(function (error) {
      console.log(error);
      toastr.error('Error while search for mapping');
    });
}
