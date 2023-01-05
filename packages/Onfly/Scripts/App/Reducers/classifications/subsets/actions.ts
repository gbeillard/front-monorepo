import {
  FETCH_SUBSETS,
  FetchSubsetsAction,
  FETCH_SUBSETS_SUCCESS,
  FetchSubsetsSuccessAction,
  FETCH_SUBSETS_ERROR,
  FetchSubsetsErrorAction,
  AddSubsetsAction,
  AddSubsetsSuccessAction,
  AddSubsetsErrorAction,
  ADD_SUBSETS,
  ADD_SUBSETS_SUCCESS,
  ADD_SUBSETS_ERROR,
  RemoveSubsetAction,
  RemoveSubsetSuccessAction,
  RemoveSubsetErrorAction,
  REMOVE_SUBSET,
  REMOVE_SUBSET_SUCCESS,
  REMOVE_SUBSET_ERROR,
  SetFilterAction,
  SET_FILTER,
  Filter,
} from './types';
import { Subset } from '../../Sets/Subsets/types';

export const fetchSubsets = (classificationId: number, nodeId: number): FetchSubsetsAction => ({
  type: FETCH_SUBSETS,
  classificationId,
  nodeId,
});

export const fetchSubsetsSuccess = (subsets: Subset[]): FetchSubsetsSuccessAction => ({
  type: FETCH_SUBSETS_SUCCESS,
  subsets,
});

export const fetchSubsetsError = (error: string): FetchSubsetsErrorAction => ({
  type: FETCH_SUBSETS_ERROR,
  error,
});

export const addSubsets = (
  classificationId: number,
  nodeId: number,
  subsets: Subset[]
): AddSubsetsAction => ({
  type: ADD_SUBSETS,
  classificationId,
  nodeId,
  subsets,
});

export const addSubsetsSuccess = (): AddSubsetsSuccessAction => ({
  type: ADD_SUBSETS_SUCCESS,
});

export const addSubsetsError = (error: any): AddSubsetsErrorAction => ({
  type: ADD_SUBSETS_ERROR,
  error,
});

export const removeSubset = (
  classificationId: number,
  nodeId: number,
  subset: Subset,
  keepPropertiesWithValue: boolean
): RemoveSubsetAction => ({
  type: REMOVE_SUBSET,
  classificationId,
  nodeId,
  subset,
  keepPropertiesWithValue,
});

export const removeSubsetSuccess = (): RemoveSubsetSuccessAction => ({
  type: REMOVE_SUBSET_SUCCESS,
});

export const removeSubsetError = (error: any): RemoveSubsetErrorAction => ({
  type: REMOVE_SUBSET_ERROR,
  error,
});

export const setFilter = (filter: Filter): SetFilterAction => ({
  type: SET_FILTER,
  filter,
});