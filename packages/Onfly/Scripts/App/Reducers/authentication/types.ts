export const CHECK_AUTHENTICATION = 'AUTHENTICATION/CHECK_AUTHENTICATION';
export const CHECK_AUTHENTICATION_SUCCESS = 'AUTHENTICATION/CHECK_AUTHENTICATION_SUCCESS';
export const CHECK_AUTHENTICATION_ERROR = 'AUTHENTICATION/CHECK_AUTHENTICATION_ERROR';

export const SIGNIN = 'AUTHENTICATION/SIGNIN';
export const SIGNIN_SUCCESS = 'AUTHENTICATION/SIGNIN_SUCCESS';
export const SIGNIN_ERROR = 'AUTHENTICATION/SIGNIN_ERROR';

export const GET_USER_INFO = 'AUTHENTICATION/GET_USER_INFO';
export const GET_USER_INFO_SUCCESS = 'AUTHENTICATION/GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_ERROR = 'AUTHENTICATION/GET_USER_INFO_ERROR';

export const SET_TOKEN = 'AUTHENTICATION/SET_TOKEN';
export const SET_PERMANENT_TOKEN = 'AUTHENTICATION/SET_PERMANENT_TOKEN';

export type CheckAuthenticationAction = {
  type: typeof CHECK_AUTHENTICATION;
};

export type CheckAuthenticationSuccessAction = {
  type: typeof CHECK_AUTHENTICATION_SUCCESS;
};

export type CheckAuthenticationErrorAction = {
  type: typeof CHECK_AUTHENTICATION_ERROR;
  error: string;
};

export type SigninAction = {
  type: typeof SIGNIN;
  code: string;
  languageCode: string;
};

export type SigninSuccessAction = {
  type: typeof SIGNIN_SUCCESS;
};

export type SigninErrorAction = {
  type: typeof SIGNIN_ERROR;
  error: string;
};

export type GetUserInfoAction = {
  type: typeof GET_USER_INFO;
};

export type GetUserInfoSuccessAction = {
  type: typeof GET_USER_INFO_SUCCESS;
  userInfo: UserInfo;
};

export type GetUserInfoErrorAction = {
  type: typeof GET_USER_INFO_ERROR;
  error: string;
};

export type SetTokenAction = {
  type: typeof SET_TOKEN;
  token: string;
};

export type SetPermanentTokenAction = {
  type: typeof SET_PERMANENT_TOKEN;
  token: string;
};

export type ConnectSSOResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type IntroscpectSSOResponse = {
  active: boolean;
  amr: string;
  aud: string;
  auth_time: number;
  client_id: string;
  exp: number;
  idp: string;
  iss: string;
  name: string;
  nbf: number;
  scope: string;
  sub: string;
  userId: string;
  iat: number;
};

export type RequestTemporaryTokenResponse = {
  Token: boolean;
  RefreshToken: string;
  UserId: number;
};

export type RefreshTokenSSOResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scopre: string;
  token_type: string;
};

export type UserInfo = {
  FirstName: string;
  LastName: string;
  Avatar: string;
  Id: number;
  Role: {
    Id: number;
    Key: string;
    Name: string;
  };
  IsBimandCoAdmin: boolean;
};

export type AuthenticationActions =
  | CheckAuthenticationAction
  | CheckAuthenticationSuccessAction
  | CheckAuthenticationErrorAction
  | SigninAction
  | SigninSuccessAction
  | SigninErrorAction
  | SetPermanentTokenAction
  | SetTokenAction;

export type State = {
  api: {
    signin: {
      pending: boolean;
      success: boolean;
      error: null | string;
    };
  };
};
