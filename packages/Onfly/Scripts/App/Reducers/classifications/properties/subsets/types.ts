import { Subset } from '../../../Sets/Subsets/types';
import { NodeProperty } from '../types';

export const ADD_SUBSET = 'CLASSIFICATIONS/PROPERTIES/SUBSETS/ADD_SUBSETS';
export const ADD_SUBSET_SUCCESS = 'CLASSIFICATIONS/PROPERTIES/SUBSETS/ADD_SUBSET_SUCCESS';
export const ADD_SUBSET_ERROR = 'CLASSIFICATIONS/PROPERTIES/SUBSETS/ADD_SUBSET_ERROR';

export const REMOVE_SUBSET = 'CLASSIFICATIONS/PROPERTIES/SUBSETS/REMOVE_SUBSET';
export const REMOVE_SUBSET_SUCCESS = 'CLASSIFICATIONS/PROPERTIES/SUBSETS/REMOVE_SUBSET_SUCCESS';
export const REMOVE_SUBSET_ERROR = 'CLASSIFICATIONS/PROPERTIES/SUBSETS/REMOVE_SUBSET_ERROR';

export type AddSubsetAction = {
  type: typeof ADD_SUBSET;
  classificationId: number;
  nodeId: number;
  property: NodeProperty;
  subset: Subset;
};

export type AddSubsetSuccessAction = {
  type: typeof ADD_SUBSET_SUCCESS;
};

export type AddSubsetErrorAction = {
  type: typeof ADD_SUBSET_ERROR;
  error: string;
};

export type RemoveSubsetAction = {
  type: typeof REMOVE_SUBSET;
  classificationId: number;
  nodeId: number;
  property: NodeProperty;
  subset: Subset;
};

export type RemoveSubsetSuccessAction = {
  type: typeof REMOVE_SUBSET_SUCCESS;
};

export type RemoveSubsetErrorAction = {
  type: typeof REMOVE_SUBSET_ERROR;
  error: string;
};

export type SubsetsActions =
  | AddSubsetAction
  | AddSubsetSuccessAction
  | AddSubsetErrorAction
  | RemoveSubsetAction
  | RemoveSubsetSuccessAction
  | RemoveSubsetErrorAction;