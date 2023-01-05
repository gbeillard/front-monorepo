import { AuthenticationActions, SIGNIN, State, SIGNIN_SUCCESS, SIGNIN_ERROR } from './types';

const initialState: State = {
  api: {
    signin: {
      pending: false,
      success: false,
      error: null,
    },
  },
};

const authenticationReducer = (
  state: State = initialState,
  action: AuthenticationActions
): State => {
  switch (action.type) {
    case SIGNIN:
      return {
        ...state,
        api: {
          ...state.api,
          signin: {
            ...state.api.signin,
            pending: true,
            success: false,
            error: null,
          },
        },
      };
    case SIGNIN_SUCCESS:
      return {
        ...state,
        api: {
          ...state.api,
          signin: {
            ...state.api.signin,
            pending: false,
            success: true,
            error: null,
          },
        },
      };
    case SIGNIN_ERROR:
      return {
        ...state,
        api: {
          ...state.api,
          signin: {
            ...state.api.signin,
            pending: false,
            success: false,
            error: action.error,
          },
        },
      };
    default:
      return state;
  }
};

export default authenticationReducer;