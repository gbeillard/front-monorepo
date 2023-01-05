import store from '../Store/Store';
import { API_URL } from './constants';

export function getPropertiesGroup(token) {
  fetch(`${API_URL}/api/ws/v1/properties-group/list/sdl?token=${token}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_PROPERTIES_GROUP_LIST' };
      store.dispatch(action);
    });
}
