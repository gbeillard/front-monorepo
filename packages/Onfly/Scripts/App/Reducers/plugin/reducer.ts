import Immutable from 'seamless-immutable';

import { UPDATE_PLUGIN_DATA } from './constants';

import { UpdatePluginDataAction } from './types';

export const baseState = {
  pluginData: {
    software: '',
    softwareVersion: '',
    pluginVersion: 0,
    bundleVersion: 0,
    configurationID: 0,
    configurationLanguage: '',
    mappingDictionaryLanguage: '',
    port: 0,
    uploadMappingConfigurationID: 0,
    uploadMappingDictionaryLanguage: '',
  },
};

const initialState = Immutable(baseState);

const pluginReducer = (state = initialState, action: UpdatePluginDataAction) => {
  switch (action.type) {
    case UPDATE_PLUGIN_DATA:
      return state.set('pluginData', action.pluginData);
    default:
      return state;
  }
};

export default pluginReducer;