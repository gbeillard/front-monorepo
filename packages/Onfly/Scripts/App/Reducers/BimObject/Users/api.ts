import { API_URL } from '../../../Api/constants';
import { request, RequestOptions } from '../../../Api/utils';

const get = (temporaryToken: string, languageCode: string, bimObjectId: number) => {
  const url = `${API_URL}/api/ws/v1/informations/${languageCode}/user/bimobject/${bimObjectId}?token=${temporaryToken}`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
  };

  return request(url, options);
};

const API = {
  get,
};

export default API;