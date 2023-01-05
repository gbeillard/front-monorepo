import { SortDirection } from '@bim-co/componentui-foundation';
import {
  FETCH_SPACES,
  FETCH_SPACES_SUCCESS,
  FETCH_SPACES_ERROR,
  SET_FILTER_SEARCH,
  CREATE_SPACE,
  CREATE_SPACE_SUCCESS,
  CREATE_SPACE_ERROR,
  DELETE_SPACE,
  DELETE_SPACE_SUCCESS,
  DELETE_SPACE_ERROR,
  UPDATE_STATUS,
  SpacesStatus,
  UPDATE_SPACE,
  UPDATE_SPACE_SUCCESS,
  UPDATE_SPACE_ERROR,
  SET_SORT_ORDER_BY,
  SET_SORT_DIRECTION,
  ASK_AUTHORIZATION_SUCCESS,
  ASK_AUTHORIZATION,
  ASK_AUTHORIZATION_ERROR,
} from './constants';

import {
  Space,
  FetchSpacesAction,
  FetchSpacesSuccessAction,
  FetchSpacesErrorAction,
  SetSpacesSearchAction,
  SpaceWrite,
  CreateSpaceAction,
  CreateSpaceSuccessAction,
  CreateSpaceErrorAction,
  DeleteSpaceAction,
  DeleteSpaceSuccessAction,
  DeleteSpaceErrorAction,
  UpdateStatusAction,
  UpdateSpaceAction,
  UpdateSpaceSuccessAction,
  UpdateSpaceErrorAction,
  SetSortOrderByAction,
  SetSortDirectionAction,
  AskAuthorizationAction,
  AskAuthorizationSuccessAction,
  AskAuthorizationErrorAction,
} from './types';

export const fetchSpaces = (): FetchSpacesAction => ({
  type: FETCH_SPACES,
});

export const fetchSpacesSuccess = (spaces: Space[]): FetchSpacesSuccessAction => ({
  type: FETCH_SPACES_SUCCESS,
  spaces,
});

export const fetchSpacesError = (error: string): FetchSpacesErrorAction => ({
  type: FETCH_SPACES_ERROR,
  error,
});

export const setSpacesSearch = (search: string): SetSpacesSearchAction => ({
  type: SET_FILTER_SEARCH,
  search,
});

export const createSpace = (space: SpaceWrite): CreateSpaceAction => ({
  type: CREATE_SPACE,
  space,
});

export const createSpaceSuccess = (space: Space): CreateSpaceSuccessAction => ({
  type: CREATE_SPACE_SUCCESS,
  space,
});

export const createSpaceError = (error: string): CreateSpaceErrorAction => ({
  type: CREATE_SPACE_ERROR,
  error,
});
export const updateStatus = (space: Space, status: SpacesStatus): UpdateStatusAction => ({
  type: UPDATE_STATUS,
  space,
  status,
});

export const deleteSpace = (spaceId: number): DeleteSpaceAction => ({
  type: DELETE_SPACE,
  spaceId,
});

export const deleteSpaceSuccess = (): DeleteSpaceSuccessAction => ({
  type: DELETE_SPACE_SUCCESS,
});

export const deleteSpaceError = (error: string): DeleteSpaceErrorAction => ({
  type: DELETE_SPACE_ERROR,
  error,
});

export const updateSpace = (space: SpaceWrite): UpdateSpaceAction => ({
  type: UPDATE_SPACE,
  space,
});

export const updateSpaceSuccess = (): UpdateSpaceSuccessAction => ({
  type: UPDATE_SPACE_SUCCESS,
});

export const updateSpaceError = (error: string): UpdateSpaceErrorAction => ({
  type: UPDATE_SPACE_ERROR,
  error,
});

export const setSortOrderBy = (sortOrderBy): SetSortOrderByAction => ({
  type: SET_SORT_ORDER_BY,
  sortOrderBy,
});

export const setSortDirection = (sortDirection: SortDirection): SetSortDirectionAction => ({
  type: SET_SORT_DIRECTION,
  sortDirection,
});

export const askAuthorization = (spaceId: number): AskAuthorizationAction => ({
  type: ASK_AUTHORIZATION,
  spaceId,
});

export const askAuthorizationSuccess = (
  spaceId: number,
  requestId: number
): AskAuthorizationSuccessAction => ({
  type: ASK_AUTHORIZATION_SUCCESS,
  spaceId,
  requestId,
});

export const askAuthorizationError = (error: string): AskAuthorizationErrorAction => ({
  type: ASK_AUTHORIZATION_ERROR,
  error,
});