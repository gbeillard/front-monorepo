import {
  SET_PROPERTIES_SETS,
  SET_FILTER,
  SET_API_STATE,
  SET_SORT_ORDER_BY,
  SET_SORT_DIRECTION,
  FETCH_SET,
  FETCH_SET_SUCCESS,
  FETCH_SET_ERROR,
  FETCH_SETS,
  FETCH_SETS_SUCCESS,
  FETCH_SETS_ERROR,
} from './constants';

export type Set = {
  Id: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  Name: string;
  Description: string;
  IsPublic: boolean;
  Statistics: SetStatistics;
};

export type SetStatistics = {
  NbProperties: number;
  NbSubsets: number;
};

export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: string;
};

export type SetApiStateAction = {
  type: typeof SET_API_STATE;
  apiState: string;
};

export type SetPropertiesStatesAction = {
  type: typeof SET_PROPERTIES_SETS;
  propertiesSets: any;
};

export type SetSortOrderByAction = {
  type: typeof SET_SORT_ORDER_BY;
  sortOrderBy: any;
};

export type SetSortDirectionAction = {
  type: typeof SET_SORT_DIRECTION;
  sortDirection: any;
};

export type FetchSetAction = {
  type: typeof FETCH_SET;
  id: number;
};

export type FetchSetSuccessAction = {
  type: typeof FETCH_SET_SUCCESS;
  set: Set;
};

export type FetchSetErrorAction = {
  type: typeof FETCH_SET_ERROR;
  error: string;
};

export type FetchSetsAction = {
  type: typeof FETCH_SETS;
};

export type FetchSetsSuccessAction = {
  type: typeof FETCH_SETS_SUCCESS;
  sets: Set[];
};

export type FetchSetsErrorAction = {
  type: typeof FETCH_SETS_ERROR;
  error: string;
};

export type ObjectsActions =
  | SetApiStateAction
  | SetFilterAction
  | SetPropertiesStatesAction
  | SetSortDirectionAction
  | SetSortOrderByAction
  | FetchSetAction
  | FetchSetSuccessAction
  | FetchSetErrorAction
  | FetchSetsAction
  | FetchSetsSuccessAction
  | FetchSetsErrorAction;