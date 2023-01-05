export const FETCH_PREFERENCES = 'PREFERENCES/FETCH_PREFERENCES';
export const FETCH_PREFERENCES_SUCCESS = 'PREFERENCES/FETCH_PREFERENCES_SUCCESS';
export const FETCH_PREFERENCES_ERROR = 'PREFERENCES/FETCH_PREFERENCES_ERROR';

export const UPDATE_PREFERENCES = 'PREFERENCES/UPDATE_PREFERENCES';
export const UPDATE_PREFERENCES_SUCCESS = 'PREFERENCES/UPDATE_PREFERENCES_SUCCESS';
export const UPDATE_PREFERENCES_ERROR = 'PREFERENCES/UPDATE_PREFERENCES_ERROR';

export enum RevitUploadPreference {
  FamilyName = 'FamilyName',
  ParameterModel = 'ParameterModel',
}
export type Preferences = {
  UploadMapping?: boolean;
  RevitDownloadPreference?: boolean;
  RevitUploadPreference?: RevitUploadPreference;
  EmptyPropertiesPreference?: boolean;
};

export type FetchPreferencesAction = {
  type: typeof FETCH_PREFERENCES;
};

export type FetchPreferencesSuccessAction = {
  type: typeof FETCH_PREFERENCES_SUCCESS;
  preferences: Preferences;
};

export type FetchPreferencesErrorAction = {
  type: typeof FETCH_PREFERENCES_ERROR;
  error: string;
};

export type UpdatePreferencesAction = {
  type: typeof UPDATE_PREFERENCES;
  preferences: Preferences;
};

export type UpdatePreferencesSuccessAction = {
  type: typeof UPDATE_PREFERENCES_SUCCESS;
};

export type UpdatePreferencesErrorAction = {
  type: typeof UPDATE_PREFERENCES_ERROR;
  error: string;
};

export type PreferencesAction =
  | FetchPreferencesAction
  | FetchPreferencesSuccessAction
  | FetchPreferencesErrorAction
  | UpdatePreferencesAction
  | UpdatePreferencesSuccessAction
  | UpdatePreferencesErrorAction;