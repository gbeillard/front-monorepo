import {
  UserEditorAuthorization,
  FETCH_AUTHORIZATION,
  FetchAuthorizationAction,
  FETCH_AUTHORIZATION_SUCCESS,
  FetchAuthorizationSuccessAction,
  FETCH_AUTHORIZATION_ERROR,
  FetchAuthorizationErrorAction,
} from './types';

export const fetchAuthorization = (bimObjectId: number): FetchAuthorizationAction => ({
  type: FETCH_AUTHORIZATION,
  bimObjectId,
});

export const fetchAuthorizationSuccess = (
  userAuthorization: UserEditorAuthorization
): FetchAuthorizationSuccessAction => ({
  type: FETCH_AUTHORIZATION_SUCCESS,
  userAuthorization,
});

export const fetchAuthorizationError = (error: string): FetchAuthorizationErrorAction => ({
  type: FETCH_AUTHORIZATION_ERROR,
  error,
});