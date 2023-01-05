import {
  ObjectVariant,
  FetchVariantsAction,
  FETCH_VARIANTS,
  FetchVariantsSuccessAction,
  FETCH_VARIANTS_SUCCESS,
  FetchVariantsErrorAction,
  FETCH_VARIANTS_ERROR,
} from './types';

export const fetchVariants = (bimObjectId: number): FetchVariantsAction => ({
  type: FETCH_VARIANTS,
  bimObjectId,
});

export const fetchVariantsSuccess = (variants: ObjectVariant[]): FetchVariantsSuccessAction => ({
  type: FETCH_VARIANTS_SUCCESS,
  variants,
});

export const fetchVariantsError = (error: Error): FetchVariantsErrorAction => ({
  type: FETCH_VARIANTS_ERROR,
  error,
});