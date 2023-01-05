import { createSelector } from 'reselect';
import { baseState } from './reducer';

const selectPlugin = (store): typeof baseState => store.plugin;

export const selectIsPlugin: any = createSelector(
  selectPlugin,
  (state) => state.pluginData?.pluginVersion > 0
);

export const selectPluginData = createSelector(selectPlugin, (state) => state.pluginData);

export const selectPluginDictionaryLanguage = createSelector(
  selectPlugin,
  (state) => state.pluginData?.mappingDictionaryLanguage
);
