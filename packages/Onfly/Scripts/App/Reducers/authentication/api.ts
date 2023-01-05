import { API_URL, SSO_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';
import {
  ConnectSSOResponse,
  IntroscpectSSOResponse,
  RefreshTokenSSOResponse,
  RequestTemporaryTokenResponse,
  UserInfo,
} from './types';

const getAccessToken = async (code: string, languageCode: string): Promise<ConnectSSOResponse> => {
  const url = `${SSO_URL}/api/connect/token`;

  const clientId = localStorage.getItem('OnflyClientId');
  const formData = new URLSearchParams();
  formData.append('code', code);
  formData.append('client_id', clientId);
  formData.append('client_secret', 'secret');
  formData.append('grant_type', 'authorization_code');
  formData.append(
    'redirect_uri',
    encodeURI(`${window.location.origin}/${languageCode}/signin-oidc`)
  );
  const body = formData.toString();
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
    },
    body,
  };
  return request(url, options);
};

const introspectToken = async (token: string): Promise<IntroscpectSSOResponse> => {
  const url = `${SSO_URL}/api/connect/introspect`;

  const formData = new URLSearchParams();
  formData.append('token', token);
  const body = formData.toString();
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      BimAndCoIntrospect: 'Basic YmltLmFwaS5vbmZseTpzZWNyZXQ=',
      Authorization: 'Basic YmltLmFwaS5vbmZseTpzZWNyZXQ=',
      Accept: '*/*',
    },
    body,
  };
  return request(url, options);
};

const requestTemporaryToken = async (
  token: string,
  contentManagementId?: string
): Promise<RequestTemporaryTokenResponse> => {
  const url = `${API_URL}/api/ws/requesttemporarykey?token=${token}&content_management_id=${contentManagementId}`;

  const formData = new URLSearchParams();
  formData.append('token', token);
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  return request(url, options);
};

const refreshToken = async (): Promise<RefreshTokenSSOResponse> => {
  const url = `${SSO_URL}/api/connect/token`;

  const clientId = localStorage.getItem('OnflyClientId');
  const token = localStorage.getItem('Refresh_token');

  const formData = new URLSearchParams();
  formData.append('client_id', clientId);
  formData.append('client_secret', 'secret');
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', token);
  const body = formData.toString();
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
    },
    body,
  };

  return request(url, options);
};

const getUserInfo = async (onflyId: number, userId: string): Promise<UserInfo> => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/users/${userId}/info`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
    },
  };

  return request(url, options);
};

export default {
  getAccessToken,
  introspectToken,
  requestTemporaryToken,
  refreshToken,
  getUserInfo,
};
