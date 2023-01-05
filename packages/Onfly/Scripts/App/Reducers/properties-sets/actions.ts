import {
  SET_PROPERTIES_SETS,
  SET_FILTER,
  SET_API_STATE,
  SET_SORT_DIRECTION,
  SET_SORT_ORDER_BY,
  FETCH_SET,
  FETCH_SET_SUCCESS,
  FETCH_SET_ERROR,
  FETCH_SETS,
  FETCH_SETS_SUCCESS,
  FETCH_SETS_ERROR,
} from './constants';
import {
  Set,
  SetFilterAction,
  SetApiStateAction,
  SetPropertiesStatesAction,
  SetSortOrderByAction,
  SetSortDirectionAction,
  FetchSetAction,
  FetchSetSuccessAction,
  FetchSetErrorAction,
  FetchSetsAction,
  FetchSetsSuccessAction,
  FetchSetsErrorAction,
} from './types';

export const setPropertiesSets = (propertiesSets): SetPropertiesStatesAction => ({
  type: SET_PROPERTIES_SETS,
  propertiesSets,
});

export const setSortOrderBy = (sortOrderBy): SetSortOrderByAction => ({
  type: SET_SORT_ORDER_BY,
  sortOrderBy,
});

export const setSortDirection = (sortDirection): SetSortDirectionAction => ({
  type: SET_SORT_DIRECTION,
  sortDirection,
});

export const setFilter = (filter: string): SetFilterAction => ({
  type: SET_FILTER,
  filter,
});

export const setApiState = (apiState: string): SetApiStateAction => ({
  type: SET_API_STATE,
  apiState,
});

export const fetchSet = (id: number): FetchSetAction => ({
  type: FETCH_SET,
  id,
});

export const fetchSetSuccess = (set: Set): FetchSetSuccessAction => ({
  type: FETCH_SET_SUCCESS,
  set,
});

export const fetchSetError = (error: string): FetchSetErrorAction => ({
  type: FETCH_SET_ERROR,
  error,
});

export const fetchSets = (): FetchSetsAction => ({
  type: FETCH_SETS,
});

export const fetchSetsSuccess = (sets: Set[]): FetchSetsSuccessAction => ({
  type: FETCH_SETS_SUCCESS,
  sets,
});

export const fetchSetsError = (error: string): FetchSetsErrorAction => ({
  type: FETCH_SETS_ERROR,
  error,
});