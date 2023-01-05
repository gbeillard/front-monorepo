import { Subset } from '../../Sets/Subsets/types';

export const FETCH_SUBSETS = 'BIMOBJECT/SUBSETS/FETCH_SUBSETS';
export const FETCH_SUBSETS_SUCCESS = 'BIMOBJECT/SUBSETS/FETCH_SUBSETS_SUCCESS';
export const FETCH_SUBSETS_ERROR = 'BIMOBJECT/SUBSETS/FETCH_SUBSETS_ERROR';

export const SET_FILTER = 'BIMOBJECT/SUBSETS/SET_FILTER';

export const DELETE_SUBSET = 'BIMOBJECT/SUBSETS/DELETE_SUBSET';
export const DELETE_SUBSET_SUCCESS = 'BIMOBJECT/SUBSETS/DELETE_SUBSET_SUCCESS';
export const DELETE_SUBSET_ERROR = 'BIMOBJECT/SUBSETS/DELETE_SUBSET_ERROR';

export const ADD_SUBSETS = 'BIMOBJECT/SUBSETS/ADD_SUBSETS';
export const ADD_SUBSETS_SUCCESS = 'BIMOBJECT/SUBSETS/ADD_SUBSETS_SUCCESS';
export const ADD_SUBSETS_ERROR = 'BIMOBJECT/SUBSETS/ADD_SUBSETS_ERROR';

export type Filter = {
  text: string;
  setId: number;
  domainId: number;
};

/* Actions */
export type FetchSubsetsAction = {
  type: typeof FETCH_SUBSETS;
  bimObjectId: number;
};

export type FetchSubsetsSuccessAction = {
  type: typeof FETCH_SUBSETS_SUCCESS;
  subsets: Subset[];
};

export type FetchSubsetsErrorAction = {
  type: typeof FETCH_SUBSETS_ERROR;
  error: string;
};

export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: Filter;
};

export type DeleteSubsetAction = {
  type: typeof DELETE_SUBSET;
  bimObjectId: number;
  subsetId: number;
  keepPropertiesWithValue: boolean;
};

export type DeleteSubsetSuccessAction = {
  type: typeof DELETE_SUBSET_SUCCESS;
};

export type DeleteSubsetErrorAction = {
  type: typeof DELETE_SUBSET_ERROR;
  error: string;
};

export type AddSubsetsAction = {
  type: typeof ADD_SUBSETS;
  bimObjectId: number;
  subsets: Subset[];
};

export type AddSubsetsSuccessAction = {
  type: typeof ADD_SUBSETS_SUCCESS;
};

export type AddSubsetsErrorAction = {
  type: typeof ADD_SUBSETS_ERROR;
  error: string;
};

export type SubsetsActions =
  | FetchSubsetsAction
  | FetchSubsetsSuccessAction
  | FetchSubsetsErrorAction
  | SetFilterAction
  | DeleteSubsetAction
  | DeleteSubsetSuccessAction
  | DeleteSubsetErrorAction
  | AddSubsetsAction
  | AddSubsetsSuccessAction
  | AddSubsetsErrorAction;