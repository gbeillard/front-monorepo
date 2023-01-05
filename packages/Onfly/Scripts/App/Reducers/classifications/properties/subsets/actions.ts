import {
  AddSubsetAction,
  AddSubsetSuccessAction,
  AddSubsetErrorAction,
  ADD_SUBSET,
  ADD_SUBSET_SUCCESS,
  ADD_SUBSET_ERROR,
  RemoveSubsetAction,
  RemoveSubsetSuccessAction,
  RemoveSubsetErrorAction,
  REMOVE_SUBSET,
  REMOVE_SUBSET_SUCCESS,
  REMOVE_SUBSET_ERROR,
} from './types';
import { Subset } from '../../../Sets/Subsets/types';
import { NodeProperty } from '../types';

export const addSubset = (
  classificationId: number,
  nodeId: number,
  property: NodeProperty,
  subset: Subset
): AddSubsetAction => ({
  type: ADD_SUBSET,
  classificationId,
  nodeId,
  property,
  subset,
});

export const addSubsetSuccess = (): AddSubsetSuccessAction => ({
  type: ADD_SUBSET_SUCCESS,
});

export const addSubsetError = (error: string): AddSubsetErrorAction => ({
  type: ADD_SUBSET_ERROR,
  error,
});

export const removeSubset = (
  classificationId: number,
  nodeId: number,
  property: NodeProperty,
  subset: Subset
): RemoveSubsetAction => ({
  type: REMOVE_SUBSET,
  classificationId,
  nodeId,
  property,
  subset,
});

export const removeSubsetSuccess = (): RemoveSubsetSuccessAction => ({
  type: REMOVE_SUBSET_SUCCESS,
});

export const removeSubsetError = (error: string): RemoveSubsetErrorAction => ({
  type: REMOVE_SUBSET_ERROR,
  error,
});