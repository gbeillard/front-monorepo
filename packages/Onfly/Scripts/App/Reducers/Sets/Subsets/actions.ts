import {
  Subset,
  FETCH_SUBSETS,
  FetchSubsetsAction,
  FETCH_SUBSETS_SUCCESS,
  FetchSubsetsSuccessAction,
  FETCH_SUBSETS_ERROR,
  FetchSubsetsErrorAction,
  FETCH_ALL_SUBSETS,
  FetchAllSubsetsAction,
  FETCH_ALL_SUBSETS_SUCCESS,
  FetchAllSubsetsSuccessAction,
  FETCH_ALL_SUBSETS_ERROR,
  FetchAllSubsetsErrorAction,
  CREATE_SUBSET,
  CreateSubsetAction,
  CREATE_SUBSET_SUCCESS,
  CreateSubsetSuccessAction,
  CREATE_SUBSET_ERROR,
  CreateSubsetErrorAction,
  ADD_SUBSET_PROPERTIES,
  AddSubsetPropertiesAction,
  ADD_SUBSET_PROPERTIES_SUCCESS,
  AddSubsetPropertiesSuccessAction,
  ADD_SUBSET_PROPERTIES_ERROR,
  AddSubsetPropertiesErrorAction,
  DELETE_SUBSET_PROPERTIES,
  DeleteSubsetPropertiesAction,
  DELETE_SUBSET_PROPERTIES_SUCCESS,
  DeleteSubsetPropertiesSuccessAction,
  DELETE_SUBSET_PROPERTIES_ERROR,
  DeleteSubsetPropertiesErrorAction,
  EDIT_SUBSETS,
  EditSubsetsAction,
  ADD_SUBSETS,
  AddSubsetsAction,
  SET_FILTER_SET,
  SetFilterSetAction,
  SET_FILTER_TEXT,
  SetFilterTextAction,
  UPDATE_SUBSET_TWO_D_MODEL_REFERENCE,
  UpdateSubsetTwoDModelReferenceAction,
  UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_SUCCESS,
  UpdateSubsetTwoDModelReferenceSuccessAction,
  UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_ERROR,
  UpdateSubsetTwoDModelReferenceErrorAction,
  UPDATE_SUBSET_THREE_D_MODEL_REFERENCE,
  UpdateSubsetThreeDModelReferenceAction,
  UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_SUCCESS,
  UpdateSubsetThreeDModelReferenceSuccessAction,
  UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_ERROR,
  UpdateSubsetThreeDModelReferenceErrorAction,
} from './types';

import { Property } from '../Properties/types';

import { Set } from '../../properties-sets/types';

/* API */

export const fetchSubsets = (setId: number): FetchSubsetsAction => ({
  type: FETCH_SUBSETS,
  setId,
});

export const fetchSubsetsSuccess = (subsets: Subset[]): FetchSubsetsSuccessAction => ({
  type: FETCH_SUBSETS_SUCCESS,
  subsets,
});

export const fetchSubsetsError = (error: string): FetchSubsetsErrorAction => ({
  type: FETCH_SUBSETS_ERROR,
  error,
});

export const fetchAllSubsets = (): FetchAllSubsetsAction => ({
  type: FETCH_ALL_SUBSETS,
});

export const fetchAllSubsetsSuccess = (subsets: Subset[]): FetchAllSubsetsSuccessAction => ({
  type: FETCH_ALL_SUBSETS_SUCCESS,
  subsets,
});

export const fetchAllSubsetsError = (error: string): FetchAllSubsetsErrorAction => ({
  type: FETCH_ALL_SUBSETS_ERROR,
  error,
});

/* Create a subset */

export const createSubset = (
  setId: number,
  subset: Subset,
  properties?: Property[]
): CreateSubsetAction => ({
  type: CREATE_SUBSET,
  setId,
  subset,
  properties,
});

export const createSubsetSuccess = (
  subset: Subset,
  properties?: Property[]
): CreateSubsetSuccessAction => ({
  type: CREATE_SUBSET_SUCCESS,
  subset,
  properties,
});

export const createSubsetError = (error: string): CreateSubsetErrorAction => ({
  type: CREATE_SUBSET_ERROR,
  error,
});

/* Add properties to subset */

export const addSubsetProperties = (
  setId: number,
  subsetId: number,
  propertyIds?: number[]
): AddSubsetPropertiesAction => ({
  type: ADD_SUBSET_PROPERTIES,
  setId,
  subsetId,
  propertyIds,
});

export const addSubsetPropertiesSuccess = (): AddSubsetPropertiesSuccessAction => ({
  type: ADD_SUBSET_PROPERTIES_SUCCESS,
});

export const addSubsetPropertiesError = (error: string): AddSubsetPropertiesErrorAction => ({
  type: ADD_SUBSET_PROPERTIES_ERROR,
  error,
});

/* Delete properties in subset */

export const deleteSubsetProperties = (
  setId: number,
  subsetId: number,
  propertyIds?: number[],
  keepPropertiesWithValue?: boolean
): DeleteSubsetPropertiesAction => ({
  type: DELETE_SUBSET_PROPERTIES,
  setId,
  subsetId,
  propertyIds,
  keepPropertiesWithValue,
});

export const deleteSubsetPropertiesSuccess = (): DeleteSubsetPropertiesSuccessAction => ({
  type: DELETE_SUBSET_PROPERTIES_SUCCESS,
});

export const deleteSubsetPropertiesError = (error: string): DeleteSubsetPropertiesErrorAction => ({
  type: DELETE_SUBSET_PROPERTIES_ERROR,
  error,
});

/* Add/Edit subsets */

export const addSubsets = (subsets: Subset[]): AddSubsetsAction => ({
  type: ADD_SUBSETS,
  subsets,
});

export const editSubsets = (subsets: Subset[]): EditSubsetsAction => ({
  type: EDIT_SUBSETS,
  subsets,
});
export const setFilterSet = (set: Set): SetFilterSetAction => ({
  type: SET_FILTER_SET,
  set,
});
export const setFilterText = (text: string): SetFilterTextAction => ({
  type: SET_FILTER_TEXT,
  text,
});

// Add variant subset

export const updateSubsetTwoDModelReference = (
  bimObjectId: number,
  modelId: number,
  variantId: number,
  subsetsIds: number[]
): UpdateSubsetTwoDModelReferenceAction => ({
  type: UPDATE_SUBSET_TWO_D_MODEL_REFERENCE,
  bimObjectId,
  modelId,
  variantId,
  subsetsIds,
});

export const updateSubsetTwoDModelReferenceSuccess =
  (): UpdateSubsetTwoDModelReferenceSuccessAction => ({
    type: UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_SUCCESS,
  });

export const updateSubsetTwoDModelReferenceError = (
  error: string
): UpdateSubsetTwoDModelReferenceErrorAction => ({
  type: UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_ERROR,
  error,
});

export const updateSubsetThreeDModelReference = (
  bimObjectId: number,
  modelId: number,
  variantId: number,
  subsetsIds: number[]
): UpdateSubsetThreeDModelReferenceAction => ({
  type: UPDATE_SUBSET_THREE_D_MODEL_REFERENCE,
  bimObjectId,
  modelId,
  variantId,
  subsetsIds,
});

export const updateSubsetThreeDModelReferenceSuccess =
  (): UpdateSubsetThreeDModelReferenceSuccessAction => ({
    type: UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_SUCCESS,
  });

export const updateSubsetThreeDModelReferenceError = (
  error: string
): UpdateSubsetThreeDModelReferenceErrorAction => ({
  type: UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_ERROR,
  error,
});