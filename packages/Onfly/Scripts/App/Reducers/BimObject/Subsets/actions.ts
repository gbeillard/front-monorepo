import {
  Filter,
  FETCH_SUBSETS,
  FetchSubsetsAction,
  FETCH_SUBSETS_SUCCESS,
  FetchSubsetsSuccessAction,
  FETCH_SUBSETS_ERROR,
  FetchSubsetsErrorAction,
  SET_FILTER,
  SetFilterAction,
  DELETE_SUBSET,
  DeleteSubsetAction,
  DELETE_SUBSET_SUCCESS,
  DeleteSubsetSuccessAction,
  DELETE_SUBSET_ERROR,
  DeleteSubsetErrorAction,
  ADD_SUBSETS,
  AddSubsetsAction,
  ADD_SUBSETS_SUCCESS,
  AddSubsetsSuccessAction,
  ADD_SUBSETS_ERROR,
  AddSubsetsErrorAction,
} from './types';
import { Subset } from '../../Sets/Subsets/types';

export const fetchSubsets = (bimObjectId: number): FetchSubsetsAction => ({
  type: FETCH_SUBSETS,
  bimObjectId,
});

export const fetchSubsetsSuccess = (subsets: Subset[]): FetchSubsetsSuccessAction => ({
  type: FETCH_SUBSETS_SUCCESS,
  subsets,
});

export const fetchSubsetsError = (error: string): FetchSubsetsErrorAction => ({
  type: FETCH_SUBSETS_ERROR,
  error,
});

export const setFilter = (filter: Filter): SetFilterAction => ({
  type: SET_FILTER,
  filter,
});

export const deleteSubset = (
  bimObjectId: number,
  subsetId: number,
  keepPropertiesWithValue: boolean
): DeleteSubsetAction => ({
  type: DELETE_SUBSET,
  bimObjectId,
  subsetId,
  keepPropertiesWithValue,
});

export const deleteSubsetSuccess = (): DeleteSubsetSuccessAction => ({
  type: DELETE_SUBSET_SUCCESS,
});

export const deleteSubsetError = (error: string): DeleteSubsetErrorAction => ({
  type: DELETE_SUBSET_ERROR,
  error,
});

export const addSubsets = (bimObjectId: number, subsets: Subset[]): AddSubsetsAction => ({
  type: ADD_SUBSETS,
  bimObjectId,
  subsets,
});

export const addSubsetsSuccess = (): AddSubsetsSuccessAction => ({
  type: ADD_SUBSETS_SUCCESS,
});

export const addSubsetsError = (error: string): AddSubsetsErrorAction => ({
  type: ADD_SUBSETS_ERROR,
  error,
});