import { request, RequestOptions } from '../../Api/utils';
import { API_URL } from '../../Api/constants';

export const addRevision = (bimObjectId: number, comment: string, temporaryToken: string) => {
  const url = `${API_URL}/api/ws/v1/bimobject/${bimObjectId}/revision/add?token=${temporaryToken}`;

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Comment: comment }),
  };

  return request(url, options);
};