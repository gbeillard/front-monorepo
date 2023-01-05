import { UPDATE_PLUGIN_DATA } from './constants';

/**
 * Models
 */

export type PluginData = {
  software: string;
  softwareVersion: string;
  pluginVersion: number;
  bundleVersion: number;
  configurationID: number;
  configurationLanguage: string;
  mappingDictionaryLanguage: string;
  port: number;
  uploadConfigurationID?: number;
  uploadConfigurationLanguage?: string;
};

/**
 * Actions
 */

export type UpdatePluginDataAction = {
  type: typeof UPDATE_PLUGIN_DATA;
  pluginData: PluginData;
};
