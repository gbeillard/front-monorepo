import { API_URL } from '../../../../Api/constants';
import { request, RequestOptions } from '../../../../Api/utils';

export const fileAPI = async (languageCode, onflyId, fileId, mediaType) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/files`;

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify([
      {
        Id: fileId,
        MediaType: mediaType,
      },
    ]),
  };

  return request(url, options);
};
