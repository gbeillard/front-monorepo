import { Subset } from '../../Sets/Subsets/types';

export const FETCH_SUBSETS = 'CLASSIFICATIONS/SUBSETS/FETCH_SUBSETS';
export const FETCH_SUBSETS_SUCCESS = 'CLASSIFICATIONS/SUBSETS/FETCH_SUBSETS_SUCCESS';
export const FETCH_SUBSETS_ERROR = 'CLASSIFICATIONS/SUBSETS/FETCH_SUBSETS_ERROR';

export const ADD_SUBSETS = 'CLASSIFICATIONS/SUBSETS/ADD_SUBSETS';
export const ADD_SUBSETS_SUCCESS = 'CLASSIFICATIONS/SUBSETS/ADD_SUBSETS_SUCCESS';
export const ADD_SUBSETS_ERROR = 'CLASSIFICATIONS/SUBSETS/ADD_SUBSETS_ERROR';

export const REMOVE_SUBSET = 'CLASSIFICATIONS/SUBSETS/REMOVE_SUBSET';
export const REMOVE_SUBSET_SUCCESS = 'CLASSIFICATIONS/SUBSETS/REMOVE_SUBSET_SUCCESS';
export const REMOVE_SUBSET_ERROR = 'CLASSIFICATIONS/SUBSETS/REMOVE_SUBSET_ERROR';

export const SET_FILTER = 'CLASSIFICATIONS/SUBSETS/SET_FILTER';

export type FetchSubsetsAction = {
  type: typeof FETCH_SUBSETS;
  classificationId: number;
  nodeId: number;
};

export type FetchSubsetsSuccessAction = {
  type: typeof FETCH_SUBSETS_SUCCESS;
  subsets: Subset[];
};

export type FetchSubsetsErrorAction = {
  type: typeof FETCH_SUBSETS_ERROR;
  error: string;
};

export type AddSubsetsAction = {
  type: typeof ADD_SUBSETS;
  classificationId: number;
  nodeId: number;
  subsets: Subset[];
};

export type AddSubsetsSuccessAction = {
  type: typeof ADD_SUBSETS_SUCCESS;
};

export type AddSubsetsErrorAction = {
  type: typeof ADD_SUBSETS_ERROR;
  error: any;
};

export type RemoveSubsetAction = {
  type: typeof REMOVE_SUBSET;
  classificationId: number;
  nodeId: number;
  subset: Subset;
  keepPropertiesWithValue: boolean;
};

export type RemoveSubsetSuccessAction = {
  type: typeof REMOVE_SUBSET_SUCCESS;
};

export type RemoveSubsetErrorAction = {
  type: typeof REMOVE_SUBSET_ERROR;
  error: any;
};

export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: Filter;
};

export type Filter = {
  text: string;
  setId: number;
};

export type SubsetsActions =
  | FetchSubsetsAction
  | FetchSubsetsSuccessAction
  | FetchSubsetsErrorAction
  | AddSubsetsAction
  | AddSubsetsSuccessAction
  | AddSubsetsErrorAction
  | RemoveSubsetAction
  | RemoveSubsetSuccessAction
  | RemoveSubsetErrorAction
  | SetFilterAction;