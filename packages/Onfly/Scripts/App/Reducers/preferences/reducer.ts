import Immutable from 'seamless-immutable';
import {
  FETCH_PREFERENCES,
  FETCH_PREFERENCES_ERROR,
  FETCH_PREFERENCES_SUCCESS,
  PreferencesAction,
  UPDATE_PREFERENCES,
  UPDATE_PREFERENCES_ERROR,
  UPDATE_PREFERENCES_SUCCESS,
} from './types';

const baseState = {
  api: {
    fetchPreferences: {
      payload: null,
      pending: false,
      error: null,
    },
    updatePreferences: {
      payload: null,
      pending: false,
      error: null,
    },
  },
  preferences: {
    UploadMapping: null,
    RevitDownloadPreference: false,
    RevitUploadPreference: '',
    EmptyPropertiesPreference: false,
  },
};

const initialState = Immutable(baseState);

const preferencesReducer = (state = initialState, action: PreferencesAction) => {
  switch (action.type) {
    case FETCH_PREFERENCES:
      return state
        .setIn(['api', 'fetchPreferences', 'pending'], true)
        .setIn(['api', 'fetchPreferences', 'error'], null);
    case FETCH_PREFERENCES_SUCCESS:
      return state
        .set('preferences', action.preferences)
        .setIn(['api', 'fetchPreferences', 'pending'], false)
        .setIn(['api', 'fetchPreferences', 'error'], null);
    case FETCH_PREFERENCES_ERROR:
      return state
        .setIn(['api', 'fetchPreferences', 'pending'], false)
        .setIn(['api', 'fetchPreferences', 'error'], action.error);
    case UPDATE_PREFERENCES:
      return state
        .update('preferences', (preferences) => ({ ...preferences, ...action.preferences }))
        .setIn(['api', 'fetchPreferences', 'pending'], true)
        .setIn(['api', 'fetchPreferences', 'error'], null);
    case UPDATE_PREFERENCES_SUCCESS:
      return state
        .setIn(['api', 'fetchPreferences', 'pending'], false)
        .setIn(['api', 'fetchPreferences', 'error'], null);
    case UPDATE_PREFERENCES_ERROR:
      return state
        .setIn(['api', 'fetchPreferences', 'pending'], false)
        .setIn(['api', 'fetchPreferences', 'error'], action.error);
    default:
      return state;
  }
};

export default preferencesReducer;