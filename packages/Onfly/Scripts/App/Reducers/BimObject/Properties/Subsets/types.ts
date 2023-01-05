import { Subset } from '../../../Sets/Subsets/types';
import { Property } from '../types';

export const ADD_SUBSET = 'BIMOBJECT/PROPERTIES/SUBSETS/ADD_SUBSETS';
export const ADD_SUBSET_SUCCESS = 'BIMOBJECT/PROPERTIES/SUBSETS/ADD_SUBSET_SUCCESS';
export const ADD_SUBSET_ERROR = 'BIMOBJECT/PROPERTIES/SUBSETS/ADD_SUBSET_ERROR';

export const REMOVE_SUBSET = 'BIMOBJECT/PROPERTIES/SUBSETS/REMOVE_SUBSET';
export const REMOVE_SUBSET_SUCCESS = 'BIMOBJECT/PROPERTIES/SUBSETS/REMOVE_SUBSET_SUCCESS';
export const REMOVE_SUBSET_ERROR = 'BIMOBJECT/PROPERTIES/SUBSETS/REMOVE_SUBSET_ERROR';

export type AddSubsetAction = {
  type: typeof ADD_SUBSET;
  bimObjectId: number;
  property: Property;
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
  bimObjectId: number;
  property: Property;
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