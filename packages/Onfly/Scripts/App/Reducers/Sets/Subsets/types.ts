import { Set } from '../../properties-sets/types';
import { Property } from '../Properties/types';

export const FETCH_SUBSETS = 'SETS/SUBSETS/FETCH_SUBSETS';
export const FETCH_ALL_SUBSETS = 'SETS/SUBSETS/FETCH_ALL_SUBSETS';
export const FETCH_SUBSETS_SUCCESS = 'SETS/SUBSETS/FETCH_SUBSETS_SUCCESS';
export const FETCH_SUBSETS_ERROR = 'SETS/SUBSETS/FETCH_SUBSETS_ERROR';
export const FETCH_ALL_SUBSETS_SUCCESS = 'SETS/SUBSETS/FETCH_ALL_SUBSETS_SUCCESS';
export const FETCH_ALL_SUBSETS_ERROR = 'SETS/SUBSETS/FETCH_ALL_SUBSETS_ERROR';

export const SET_SUBSETS = 'SETS/SUBSETS/SET_SUBSETS';

export const CREATE_SUBSET = 'SETS/SUBSETS/CREATE_SUBSET';
export const CREATE_SUBSET_SUCCESS = 'SETS/SUBSETS/CREATE_SUBSET_SUCCESS';
export const CREATE_SUBSET_ERROR = 'SETS/SUBSETS/CREATE_SUBSET_ERROR';

export const ADD_SUBSET_PROPERTIES = 'SETS/SUBSETS/ADD_SUBSET_PROPERTIES';
export const ADD_SUBSET_PROPERTIES_SUCCESS = 'SETS/SUBSETS/ADD_SUBSET_PROPERTIES_SUCCESS';
export const ADD_SUBSET_PROPERTIES_ERROR = 'SETS/SUBSETS/ADD_SUBSET_PROPERTIES_ERROR';

export const DELETE_SUBSET_PROPERTIES = 'SETS/SUBSETS/DELETE_SUBSET_PROPERTIES';
export const DELETE_SUBSET_PROPERTIES_SUCCESS = 'SETS/SUBSETS/DELETE_SUBSET_PROPERTIES_SUCCESS';
export const DELETE_SUBSET_PROPERTIES_ERROR = 'SETS/SUBSETS/DELETE_SUBSET_PROPERTIES_ERROR';

export const ADD_SUBSETS = 'SETS/SUBSETS/ADD_SUBSETS';
export const EDIT_SUBSETS = 'SETS/SUBSETS/EDIT_SUBSETS';

export const SET_FILTER_SET = 'SETS/SUBSETS/SET_FILTER_SET';
export const SET_FILTER_TEXT = 'SETS/SUBSETS/SET_FILTER_TEXT';

export const UPDATE_SUBSET_TWO_D_MODEL_REFERENCE =
  'SETS/SUBSETS/UPDATE_SUBSET_TWO_D_MODEL_REFERENCE';
export const UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_SUCCESS =
  'SETS/SUBSETS/UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_SUCCESS';
export const UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_ERROR =
  'SETS/SUBSETS/UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_ERROR';

export const UPDATE_SUBSET_THREE_D_MODEL_REFERENCE =
  'SETS/SUBSETS/UPDATE_SUBSET_THREE_D_MODEL_REFERENCE';
export const UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_SUCCESS =
  'SETS/SUBSETS/UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_SUCCESS';
export const UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_ERROR =
  'SETS/SUBSETS/UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_ERROR';

export type SubsetOption = {
  value: number | string;
  label: string;
  color?: string;
  __isNew__?: boolean;
};

export type CreateSubsetSuccess = {
  /** Subset created */
  subset: Subset;
  /** Properties of subset created */
  properties?: Property[];
};

/*
    Models
*/

export enum SubsetSource {
  Node = 'Node', // node -> subset // subset ajouté au noeud
  NodeProperty = 'NodeProperty', // node -> property -> subset // surcharge d'une propriété du noeud
  NodeSubsetProperty = 'NodeSubsetProperty', // node -> subset -> property -> subset // surcharge d'une propriété du subset ajouté au noeud
  BimObjectSubset = 'BimObjectSubset', // bimObject -> subset // subset ajouté à un objet
  BimObjectProperty = 'BimObjectProperty', // bimObject -> property -> subset // surcharge d'une propriété de l'objet
  BimObjectSubsetProperty = 'BimObjectSubsetProperty', // bimObject -> subset -> property -> subset // surcharge d'une propriété du subset ajouté à l'objet
}
export type Subset = {
  Id: number;
  Name: string;
  IsDefault: boolean;
  Set?: Set;
  Sources?: SubsetSource[];
};

export type SubsetForDisplay = Subset & {
  displayName: string;
};

export type SubsetCreate = {
  Name: string;
};

/*
    Actions
*/

/* API */

export type FetchSubsetsAction = {
  type: typeof FETCH_SUBSETS;
  setId?: number;
};

export type FetchAllSubsetsAction = {
  type: typeof FETCH_ALL_SUBSETS;
};

export type FetchSubsetsSuccessAction = {
  type: typeof FETCH_SUBSETS_SUCCESS;
  subsets: Subset[];
};

export type FetchSubsetsErrorAction = {
  type: typeof FETCH_SUBSETS_ERROR;
  error: string;
};

export type FetchAllSubsetsSuccessAction = {
  type: typeof FETCH_ALL_SUBSETS_SUCCESS;
  subsets: Subset[];
};

export type FetchAllSubsetsErrorAction = {
  type: typeof FETCH_ALL_SUBSETS_ERROR;
  error: string;
};

export type CreateSubsetAction = {
  type: typeof CREATE_SUBSET;
  setId: number;
  subset: Subset;
  properties?: Property[];
};

export type CreateSubsetSuccessAction = {
  type: typeof CREATE_SUBSET_SUCCESS;
  subset: Subset;
  properties?: Property[];
};

export type CreateSubsetErrorAction = {
  type: typeof CREATE_SUBSET_ERROR;
  error: string;
};

export type AddSubsetPropertiesAction = {
  type: typeof ADD_SUBSET_PROPERTIES;
  setId: number;
  subsetId: number;
  propertyIds: number[];
};

export type AddSubsetPropertiesSuccessAction = {
  type: typeof ADD_SUBSET_PROPERTIES_SUCCESS;
};

export type AddSubsetPropertiesErrorAction = {
  type: typeof ADD_SUBSET_PROPERTIES_ERROR;
  error: string;
};

export type DeleteSubsetPropertiesAction = {
  type: typeof DELETE_SUBSET_PROPERTIES;
  setId: number;
  subsetId: number;
  propertyIds: number[];
  keepPropertiesWithValue?: boolean;
};

export type DeleteSubsetPropertiesSuccessAction = {
  type: typeof DELETE_SUBSET_PROPERTIES_SUCCESS;
};

export type DeleteSubsetPropertiesErrorAction = {
  type: typeof DELETE_SUBSET_PROPERTIES_ERROR;
  error: string;
};

export type AddSubsetsAction = {
  type: typeof ADD_SUBSETS;
  subsets: Subset[];
};

export type EditSubsetsAction = {
  type: typeof EDIT_SUBSETS;
  subsets: Subset[];
};
export type SetFilterSetAction = {
  type: typeof SET_FILTER_SET;
  set: Set;
};
export type SetFilterTextAction = {
  type: typeof SET_FILTER_TEXT;
  text: string;
};

// bim object models references =>
export type UpdateSubsetTwoDModelReferenceAction = {
  type: typeof UPDATE_SUBSET_TWO_D_MODEL_REFERENCE;
  bimObjectId: number;
  modelId: number;
  variantId: number;
  subsetsIds: number[];
};

export type UpdateSubsetTwoDModelReferenceSuccessAction = {
  type: typeof UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_SUCCESS;
};

export type UpdateSubsetTwoDModelReferenceErrorAction = {
  type: typeof UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_ERROR;
  error: string;
};

export type UpdateSubsetThreeDModelReferenceAction = {
  type: typeof UPDATE_SUBSET_THREE_D_MODEL_REFERENCE;
  bimObjectId: number;
  modelId: number;
  variantId: number;
  subsetsIds: number[];
};

export type UpdateSubsetThreeDModelReferenceSuccessAction = {
  type: typeof UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_SUCCESS;
};

export type UpdateSubsetThreeDModelReferenceErrorAction = {
  type: typeof UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_ERROR;
  error: string;
};

export type SubsetsActions =
  | FetchSubsetsAction
  | FetchSubsetsSuccessAction
  | FetchSubsetsErrorAction
  | FetchAllSubsetsAction
  | FetchAllSubsetsSuccessAction
  | FetchAllSubsetsErrorAction
  | CreateSubsetAction
  | CreateSubsetSuccessAction
  | CreateSubsetErrorAction
  | AddSubsetPropertiesAction
  | AddSubsetPropertiesSuccessAction
  | AddSubsetPropertiesErrorAction
  | DeleteSubsetPropertiesAction
  | DeleteSubsetPropertiesSuccessAction
  | DeleteSubsetPropertiesErrorAction
  | AddSubsetsAction
  | EditSubsetsAction
  | SetFilterSetAction
  | SetFilterTextAction
  | UpdateSubsetTwoDModelReferenceAction
  | UpdateSubsetTwoDModelReferenceSuccessAction
  | UpdateSubsetTwoDModelReferenceErrorAction
  | UpdateSubsetThreeDModelReferenceAction
  | UpdateSubsetThreeDModelReferenceSuccessAction
  | UpdateSubsetThreeDModelReferenceErrorAction;