import { API_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';
import { GroupType } from '../groups/constants';
import { SearchRequest, SearchResponse, SearchObjectGroup } from './types';

const getCleanRequest = (request: SearchRequest, groupId: number): SearchRequest => {
  if (!groupId) {
    return request;
  }

  return {
    ...request,
    ContentManagementLibraries: [],
  };
};

const search = async (
  searchRequest: SearchRequest,
  onflyId: number,
  token: string,
  group?: SearchObjectGroup
): Promise<SearchResponse> => {
  let url = `${API_URL}/api/ws/v1/contentmanagement/${onflyId}/search/results?token=${token}`;

  if (group?.id) {
    switch (group?.type) {
      case GroupType.Collection:
        url = `${API_URL}/api/v10/onfly/${onflyId}/collections/${group?.id}/bimobjects`;
        break;
      case GroupType.Project:
        url = `${API_URL}/api/ws/v1/contentmanagement/${onflyId}/group/${group?.id}/search/results?token=${token}`;
        break;
      default:
        break;
    }
  }

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(getCleanRequest(searchRequest, group?.id)),
  };

  if (group?.id && group?.type === GroupType.Collection) {
    return request(url, options);
  }

  const response = await fetch(url, options);
  return response.json();
};

const getBimObjectInformations = (
  temporaryToken: string,
  languageCode: string,
  bimObjectId: number
) => {
  const url = `${API_URL}/api/ws/v1/bimobject/${bimObjectId}/informations/${languageCode}?token=${temporaryToken}`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
    body: JSON.stringify({
      GeneralInformations: true,
    }),
  };

  return request(url, options);
};

export default {
  search,
  getBimObjectInformations,
};