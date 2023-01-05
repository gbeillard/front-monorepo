import store from '../Store/Store';
import { API_URL } from './constants';

export function getUnreadMessages(managementCloudId, token) {
  fetch(
    `${API_URL}/api/ws/v1/messages/Unread?token=${token}&contentManagementId=${managementCloudId}`,
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
      const action = { data: json, type: 'UPDATE_UNREAD_MESSAGES_COUNT' };
      store.dispatch(action);
    });
}
