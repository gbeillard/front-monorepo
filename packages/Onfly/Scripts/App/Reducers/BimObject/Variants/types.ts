export const FETCH_VARIANTS = 'BIMOBJECTS/VARIANTS/FETCH_VARIANTS';
export const FETCH_VARIANTS_SUCCESS = 'BIMOBJECTS/VARIANTS/FETCH_VARIANTS_SUCCESS';
export const FETCH_VARIANTS_ERROR = 'BIMOBJECTS/VARIANTS/FETCH_VARIANTS_ERROR';

export type ObjectVariant = {
  Id: number;
  Name: string;
};

export type FetchVariantsAction = {
  type: typeof FETCH_VARIANTS;
  bimObjectId: number;
};

export type FetchVariantsSuccessAction = {
  type: typeof FETCH_VARIANTS_SUCCESS;
  variants: ObjectVariant[];
};

export type FetchVariantsErrorAction = {
  type: typeof FETCH_VARIANTS_ERROR;
  error: Error;
};

export type ObjectVariantsActions =
  | FetchVariantsAction
  | FetchVariantsSuccessAction
  | FetchVariantsErrorAction;