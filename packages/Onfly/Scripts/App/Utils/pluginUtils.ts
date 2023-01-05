/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-underscore-dangle */
import _ from 'underscore';
import toastr from 'toastr';

import store from '../Store/Store';

import { getPropertiesSetBundle } from '../Api/PropertiesSetApi';
import { getContentBundle } from '../Api/pluginAPI';

import * as QWebChannelUtils from './qwebchannelUtils';

import * as BundleUtils from './bundleUtils';

export const isNewBACEngine = () => window._isPlugin && window._pluginVersion >= 321;

declare let window: any;

/**
 * In charge of sending data to BACEngine
 * @param bundleData
 */
const sendBundleData = (properties) => {
  if (QWebChannelUtils.isConnected()) {
    const category = isNewBACEngine() ? 'SendPropertiesBundle' : 'SendPropertiesList';
    QWebChannelUtils.sendMessage({
      Category: category,
      Action: 'set',
      Data: { PropertiesList: properties },
    });
  }
};

const getBundleRequestTemplate = (managementCloudId, language) => ({
  Lang: language || window._mappingConfigurationLanguage,
  Parameters: {
    PluginVersion: window._pluginVersion,
    MappingConfigurationId: window._mappingConfigurationID,
    OnflyId: managementCloudId,
    MappingConfigurationLanguageCode: window._mappingConfigurationLanguage,
    MappingDictionaryLanguageCode: window._mappingDictionaryLanguage,
    CaoName: window._softwarePlugin,
  },
});

/**
 * Create and send a query to API then send results to BACEngine
 * @param properties
 * @param subsets
 */
export const downloadPropertiesBundle = async (
  properties = [],
  subsets = [],
  managementCloudId,
  token,
  resources
) => {
  if (!(properties?.length || subsets?.length)) {
    sendBundleData(null);
  }
  const bundleRequest = {
    ...getBundleRequestTemplate(managementCloudId, null),
    Properties: properties,
    Subsets: subsets,
  };
  store.dispatch({ type: 'LOADER', state: true });
  const res = getPropertiesSetBundle(bundleRequest, token, resources);
  res.then((results) => {
    if (results !== null) {
      if (isNewBACEngine()) {
        sendBundleData(results);
      } else {
        const xmlProperties = BundleUtils.getXmlDocFromBundle(results);
        const formattedOldProperties = BundleUtils.getPropertiesFromBundle(xmlProperties);
        sendBundleData(formattedOldProperties);
      }
    }
    store.dispatch({ type: 'LOADER', state: false });
  });
};

/**
 * Handle download content with the Plugin
 * @param {any} content
 * @param {number} managementCloudId
 * @param {boolean} enableIfcSDL
 * @param {any} resources
 */
export const downloadPluginContent = async (
  content,
  managementCloudId,
  enableIfcSDL = true,
  resources,
  language
) => {
  if (!content || !['3DMODEL', '2DMODEL'].includes(content.MediaType)) {
    return false;
  }
  const bundleRequest = {
    ...getBundleRequestTemplate(managementCloudId, language),
    Properties: [],
    Subsets: [],
    Variants: [],
    Model3DId: content?.Id,
    Options: {
      EnableIFC: enableIfcSDL,
    },
  };
  const contentPromise = getContentBundle(
    bundleRequest,
    content?.BimObject?.Id,
    window._bundleVersion,
    managementCloudId
  );
  return contentPromise.then((results) => {
    downloadPluginBundle(results, resources);
    return results !== null;
  });
};

export const downloadPluginBundle = (bundle: string, resources: any) => {
  if (bundle) {
    if (QWebChannelUtils.isConnected()) {
      QWebChannelUtils.sendMessage({
        Category: 'SmartDownloadBundle',
        Action: 'set',
        Data: [bundle],
      });
    } else {
      window.location = '/download/bundle';
    }
  } else {
    toastr.error(resources.BimObjectDetails.DownloadFail);
  }
};

export const getSoftwaresListFilteredByVersionNumber = (pluginData, softwares) =>
  softwares
    .map((software) => ({
      id: software.Id,
      name: software.Name,
      version: software?.Version?.toString(),
      data: software,
    }))
    .filter(
      (software) =>
        software.name.toLowerCase() === pluginData?.software?.toLowerCase() &&
        (software.version === '' ||
          parseInt(software.version) <= parseInt(pluginData?.softwareVersion))
    );
