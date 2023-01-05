import { SortDirection } from '@bim-co/componentui-foundation';
import { Role } from '../Roles/types';
import {
  FETCH_SPACES,
  FETCH_SPACES_SUCCESS,
  FETCH_SPACES_ERROR,
  SET_FILTER_SEARCH,
  DELETE_SPACE_SUCCESS,
  DELETE_SPACE_ERROR,
  DELETE_SPACE,
  UPDATE_STATUS,
  SpacesStatus,
  CREATE_SPACE,
  CREATE_SPACE_SUCCESS,
  CREATE_SPACE_ERROR,
  UPDATE_SPACE_ERROR,
  UPDATE_SPACE_SUCCESS,
  UPDATE_SPACE,
  SET_SORT_ORDER_BY,
  SET_SORT_DIRECTION,
  ASK_AUTHORIZATION,
  ASK_AUTHORIZATION_SUCCESS,
  ASK_AUTHORIZATION_ERROR,
} from './constants';

export type SpaceWrite = {
  Id?: number;
  Name: string;
  Description?: string;
  SubDomain: string;
  CreatedAt?: Date;
  CreatedBy?: SpaceUser;
  UpdatedBy?: SpaceUser;
  UpdatedAt?: Date;
  AccessRequest?: AccessRequest;
};

export type Space = SpaceWrite & {
  Id: number;
  ObjectsCount: number;
  Status?: SpacesStatus;
  EntityId: string;
  EntityType: string;
  Role: Role;
  NbObject: number;
  UpdatedBy: SpaceUser;
  UpdatedAt: Date;
};

export type SpaceUser = {
  Id: number;
  FirstName: string;
  LastName: string;
};

export type AccessRequest = {
  Id: number;
};

/* Actions */

export type FetchSpacesAction = {
  type: typeof FETCH_SPACES;
};

export type FetchSpacesSuccessAction = {
  type: typeof FETCH_SPACES_SUCCESS;
  spaces: Space[];
};

export type FetchSpacesErrorAction = {
  type: typeof FETCH_SPACES_ERROR;
  error: string;
};

export type SetSpacesSearchAction = {
  type: typeof SET_FILTER_SEARCH;
  search: string;
};

export type UpdateStatusAction = {
  type: typeof UPDATE_STATUS;
  space: Space;
  status: SpacesStatus;
};

export type DeleteSpaceSuccessAction = {
  type: typeof DELETE_SPACE_SUCCESS;
};

export type DeleteSpaceErrorAction = {
  type: typeof DELETE_SPACE_ERROR;
  error: string;
};
export type DeleteSpaceAction = {
  type: typeof DELETE_SPACE;
  spaceId: number;
};
export type CreateSpaceAction = {
  type: typeof CREATE_SPACE;
  space: SpaceWrite;
};

export type CreateSpaceSuccessAction = {
  type: typeof CREATE_SPACE_SUCCESS;
  space: SpaceWrite;
};

export type CreateSpaceErrorAction = {
  type: typeof CREATE_SPACE_ERROR;
  error: string;
};

export type UpdateSpaceAction = {
  type: typeof UPDATE_SPACE;
  space: SpaceWrite;
};

export type UpdateSpaceSuccessAction = {
  type: typeof UPDATE_SPACE_SUCCESS;
};

export type UpdateSpaceErrorAction = {
  type: typeof UPDATE_SPACE_ERROR;
  error: string;
};

export type SetSortOrderByAction = {
  type: typeof SET_SORT_ORDER_BY;
  sortOrderBy: string;
};

export type SetSortDirectionAction = {
  type: typeof SET_SORT_DIRECTION;
  sortDirection: SortDirection;
};

export type AskAuthorizationAction = {
  type: typeof ASK_AUTHORIZATION;
  spaceId: number;
};

export type AskAuthorizationSuccessAction = {
  type: typeof ASK_AUTHORIZATION_SUCCESS;
  spaceId: number;
  requestId: number;
};

export type AskAuthorizationErrorAction = {
  type: typeof ASK_AUTHORIZATION_ERROR;
  error: string;
};

export type SpacesActions =
  | FetchSpacesAction
  | FetchSpacesSuccessAction
  | FetchSpacesErrorAction
  | SetSpacesSearchAction
  | CreateSpaceAction
  | CreateSpaceSuccessAction
  | CreateSpaceErrorAction
  | UpdateStatusAction
  | DeleteSpaceAction
  | DeleteSpaceSuccessAction
  | DeleteSpaceErrorAction
  | UpdateSpaceAction
  | UpdateSpaceSuccessAction
  | UpdateSpaceErrorAction
  | SetSortOrderByAction
  | SetSortDirectionAction
  | AskAuthorizationAction
  | AskAuthorizationSuccessAction
  | AskAuthorizationErrorAction;