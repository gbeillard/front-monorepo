import {
  CheckAuthenticationAction,
  CheckAuthenticationErrorAction,
  CheckAuthenticationSuccessAction,
  CHECK_AUTHENTICATION,
  CHECK_AUTHENTICATION_ERROR,
  CHECK_AUTHENTICATION_SUCCESS,
  GetUserInfoAction,
  GetUserInfoErrorAction,
  GetUserInfoSuccessAction,
  GET_USER_INFO,
  GET_USER_INFO_ERROR,
  GET_USER_INFO_SUCCESS,
  SetPermanentTokenAction,
  SetTokenAction,
  SET_PERMANENT_TOKEN,
  SET_TOKEN,
  SIGNIN,
  SigninAction,
  SigninErrorAction,
  SigninSuccessAction,
  SIGNIN_ERROR,
  SIGNIN_SUCCESS,
  UserInfo,
} from './types';

export const checkAuthentication = (): CheckAuthenticationAction => ({
  type: CHECK_AUTHENTICATION,
});

export const checkAuthenticationSuccess = (): CheckAuthenticationSuccessAction => ({
  type: CHECK_AUTHENTICATION_SUCCESS,
});

export const checkAuthenticationError = (error: string): CheckAuthenticationErrorAction => ({
  type: CHECK_AUTHENTICATION_ERROR,
  error,
});

export const signin = (code: string, languageCode: string): SigninAction => ({
  type: SIGNIN,
  code,
  languageCode,
});

export const signinSuccess = (): SigninSuccessAction => ({
  type: SIGNIN_SUCCESS,
});

export const signinError = (error: string): SigninErrorAction => ({
  type: SIGNIN_ERROR,
  error,
});

export const getUserInfo = (): GetUserInfoAction => ({
  type: GET_USER_INFO,
});

export const getUserInfoSuccess = (userInfo: UserInfo): GetUserInfoSuccessAction => ({
  type: GET_USER_INFO_SUCCESS,
  userInfo,
});

export const getUserInfoError = (error: string): GetUserInfoErrorAction => ({
  type: GET_USER_INFO_ERROR,
  error,
});

export const setToken = (token: string): SetTokenAction => ({
  type: SET_TOKEN,
  token,
});

export const setPermanentToken = (token: string): SetPermanentTokenAction => ({
  type: SET_PERMANENT_TOKEN,
  token,
});