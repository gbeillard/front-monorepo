import Immutable from 'seamless-immutable';
import {
  ObjectVariantsActions,
  ObjectVariant,
  FETCH_VARIANTS,
  FETCH_VARIANTS_SUCCESS,
  FETCH_VARIANTS_ERROR,
} from './types';

export const baseState = {
  api: {
    fetchVariants: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
  variants: [] as ObjectVariant[],
};

const initialState = Immutable(baseState);

const variantsReducer = (state = initialState, action: ObjectVariantsActions) => {
  switch (action.type) {
    case FETCH_VARIANTS:
      return state
        .setIn(['api', 'fetchVariants', 'pending'], true)
        .setIn(['api', 'fetchVariants', 'success'], false)
        .setIn(['api', 'fetchVariants', 'error'], undefined);
    case FETCH_VARIANTS_SUCCESS:
      return state
        .setIn(['api', 'fetchVariants', 'pending'], false)
        .setIn(['api', 'fetchVariants', 'success'], true)
        .setIn(['api', 'fetchVariants', 'error'], undefined)
        .setIn(['variants'], action.variants);
    case FETCH_VARIANTS_ERROR:
      return state
        .setIn(['api', 'fetchVariants', 'pending'], false)
        .setIn(['api', 'fetchVariants', 'success'], false)
        .setIn(['api', 'fetchVariants', 'error'], action.error);
    default:
      return state;
  }
};

export default variantsReducer;