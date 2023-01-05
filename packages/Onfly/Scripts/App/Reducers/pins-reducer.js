import * as types from '../Actions/pins-actions';

const initialState = {
  PinsList: [],
};

const searchReducer = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case types.UPDATE_PINS_LIST:
      return { ...state, PinsList: action.data };
    default:
      return state;
  }
};

export default searchReducer;
