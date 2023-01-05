import { runSaga } from 'redux-saga';
import * as uuid from 'uuid';
import { searchObjects } from './sagas';
import {
  SearchType,
  SearchSortingName,
  SearchSortingOrder,
  LanguageCode,
  SearchRequest,
  SearchResponse,
  SEARCH_OBJECTS_START,
  SearchObjectGroup,
} from './types';
import { searchObjectsSuccess, searchObjectsError } from './actions';

import API from './api';
import { GroupType } from '../groups/constants';

jest.mock('uuid');
const mockedUuid: jest.Mocked<typeof uuid> = uuid as any;

jest.mock('./api');
const mockedAPI: jest.Mocked<typeof API> = API as any;

describe('objectsReducer - sagas', () => {
  const searchToken = 'generated-token-abc-123';
  mockedUuid.v4.mockReturnValue(searchToken);
  describe('searchObjects', () => {
    const onflyId = 1;
    const token = 'abc-123';
    const languageCode = 'fr';
    const searchId = 'def-456';
    const request: SearchRequest = {
      Id: 'abc123',
      SearchType: SearchType.Object,
      SearchValue: { Value: 'abc' },
      SearchSorting: {
        Name: SearchSortingName.CreatedAt,
        Order: SearchSortingOrder.Desc,
      },
      SearchPaging: { From: 0, Size: 16 },
      LanguageCode: LanguageCode.English,
      ContentManagementLibraries: [],
      SearchContainerFilter: { ValueContainerFilter: [] },
      StaticFilters: {},
    };
    const group: SearchObjectGroup = {
      id: 3,
      type: GroupType.Project,
      isFavorite: false,
    };
    const response: SearchResponse = {
      Id: 'abc123',
      Total: 20,
      Size: 100,
      StaticFilters: {},
      Documents: [],
    };
    const error = new Error('oops!');
    let dispatched: any[];
    beforeEach(() => {
      dispatched = [];
    });
    // skipped for now because we need to find a way to mock
    it('should call the api with the relevant parameters', async () => {
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({
            appState: {
              ManagementCloudId: onflyId,
              TemporaryToken: token,
              Language: languageCode,
            },
            objects: {
              request,
              group,
              searchId,
            },
          }),
        },
        searchObjects
      ).toPromise();
      const updatedRequest = {
        ...request,
        languageCode,
        Id: searchToken,
      };
      expect(mockedAPI.search).toHaveBeenLastCalledWith(updatedRequest, onflyId, token, group);
    });
    it('should dispatch a success when the api returns a response', async () => {
      mockedAPI.search.mockResolvedValueOnce(response);
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({
            appState: {
              ManagementCloudId: onflyId,
              TemporaryToken: token,
            },
            objects: {
              request,
            },
          }),
        },
        searchObjects
      ).toPromise();
      expect(dispatched[0].type).toEqual(SEARCH_OBJECTS_START);
      expect(dispatched[1]).toEqual(
        searchObjectsSuccess(response, { withResults: true, withFilters: true })
      );
    });
    it('should dispatch an error when the api fails', async () => {
      mockedAPI.search.mockRejectedValueOnce(error);
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({
            appState: {
              ManagementCloudId: onflyId,
              TemporaryToken: token,
            },
            objects: {
              request,
            },
          }),
        },
        searchObjects
      ).toPromise();
      expect(dispatched[0].type).toEqual(SEARCH_OBJECTS_START);
      expect(dispatched[1]).toEqual(searchObjectsError(error));
    });
  });
});