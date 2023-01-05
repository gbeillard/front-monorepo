import { API_URL } from '../../../Api/constants';
import { ObjectVariant } from './types';

const APIKEY = localStorage.getItem('ApiKey');

const list = async (
  languageCode: string,
  token: string,
  bimObjectId: number
): Promise<ObjectVariant[]> => {
  const url = `${API_URL}/api/v10/bimobjects/${bimObjectId}/variants?token=${token}`;

  const options = {
    method: 'GET',
    headers: {
      'Accept-Language': languageCode,
      'Api-Key': APIKEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, options);
  return response.json();
};

const API = {
  list,
};

export default API;