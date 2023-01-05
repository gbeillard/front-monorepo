import { init as initApm } from '@elastic/apm-rum'
var apm = initApm({
  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'Onfly',
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'https://cce0502ca21b4f91a79ebec66d75a519.apm.francecentral.azure.elastic-cloud.com:443',
  // Set the service version (required for source map feature)
  serviceVersion: '3.3',
  // Set the service environment
  environment: 'RC'
})

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react';
import ReactDOM from 'react-dom';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Store/Store';
import * as QWebChannelUtils from './Utils/qwebchannelUtils.js';
import App from './React/App';

// CSS
import '../../Content/bootstrap.scss';
import '../../Content/listes.scss';
import '../../Content/users.scss';
import '../../Content/edit.scss';
import '../../Content/toastr.min.css';
import '../jqwidgets/styles/jqx.base.css';
import '../../Content/jquery.scrolling-tabs.scss';
import '../tipped/tipped.css';
import '../../Content/messages.scss';
import '../../Content/animate.css';
import '../../Content/classifications.scss';
import '../../Content/mapping.scss';
import '../../Content/default.scss';
import './Styles/DS-modal.css';

// JS
import '../bootstrap/js/bootstrap.js';
import '../jquery.scrolling-tabs.js';

// Sentry

import * as Sentry from '@sentry/react';
import { initSentry } from '../../sentry';
import { history } from './history';


initSentry();

// changeUrl
const changeUrl = function (url) {
    const parsedUrl = new URL(url);
    const parsedActualUrl = new URL(window.location.href);
    store.dispatch({ type: 'LOADER', state: false });
    store.dispatch({ type: 'URL', state: parsedUrl?.href });
    if (parsedUrl.hostname === parsedActualUrl.hostname) {
        history.push(parsedUrl.pathname + parsedUrl.search + parsedUrl.hash); // test this
    } else {
        window.location.href = url;
    }
};

window.changeUrl = changeUrl;

window._isPlugin = false;
window._softwarePlugin = '';
window._softwarePluginVersion = null;
window._pluginVersion = 0;
window._bundleVersion = 4;
window._mappingConfigurationID = 0;
window._mappingConfigurationLanguage = 'en';
window._mappingDictionaryLanguage = 'en';
window._uploadMappingConfigurationID = 0;
window._uploadMappingConfigurationLanguage = 'en';
window._uploadMappingDictionaryLanguage = 'en';

const accessPlugin = function (software, software_version, plugin_version, bundle_version, configurationID, configurationLanguage, port) {
    window._isPlugin = true;
    const accessPluginModel = {};

    if (software) { // not null or undefined
        accessPluginModel.Software = software;
    }

    if (software_version) {
        accessPluginModel.SoftwareVersion = software_version;
    }

    if (plugin_version) {
        accessPluginModel.PluginVersion = plugin_version;
    }

    if (bundle_version) {
        accessPluginModel.BundleVersion = bundle_version;
    }

    if (configurationID) {
        accessPluginModel.MappingConfigurationID = configurationID;
        accessPluginModel.UploadMappingConfigurationID = configurationID;
        accessPluginModel.MappingDictionaryLanguage = configurationID;
    }

    if (configurationLanguage) {
        accessPluginModel.MappingConfigurationLanguage = configurationLanguage;
        accessPluginModel.UploadMappingConfigurationLanguage = configurationLanguage;
        // Dans les versions du plugin avant la 3.2.1, on prenait toujours en compte le dictionnaire
        // Remplir ce champs permet de continuer de le prendre en compte dans les versions antérieures
        accessPluginModel.UploadMappingDictionaryLanguage = configurationLanguage;
    }

    if (port) {
        accessPluginModel.Port = port;
    }

    accessPluginV2(accessPluginModel);
};

const accessPluginV2 = function (accessPluginModel) {
    window._isPlugin = true;
    localStorage.setItem('context', 'plugin');

    const pluginData = {};

    if (accessPluginModel.Software) {
        window._softwarePlugin = accessPluginModel.Software;
        pluginData.software = accessPluginModel.Software;
    }

    if (accessPluginModel.SoftwareVersion) {
        window._softwarePluginVersion = accessPluginModel.SoftwareVersion;
        pluginData.softwareVersion = accessPluginModel.SoftwareVersion;
    }

    if (accessPluginModel.PluginVersion) {
        window._pluginVersion = accessPluginModel.PluginVersion;
        pluginData.pluginVersion = accessPluginModel.PluginVersion;
    }

    if (accessPluginModel.BundleVersion) {
        window._bundleVersion = accessPluginModel.BundleVersion;
        pluginData.bundleVersion = accessPluginModel.BundleVersion;
    }

    if (accessPluginModel.MappingConfigurationID) {
        window._mappingConfigurationID = accessPluginModel.MappingConfigurationID;
        pluginData.configurationID = accessPluginModel.MappingConfigurationID;
    }

    window._mappingDictionaryLanguage = accessPluginModel.MappingDictionaryLanguage;
    pluginData.mappingDictionaryLanguage = accessPluginModel.MappingDictionaryLanguage;

    window._mappingConfigurationLanguage = accessPluginModel.MappingConfigurationLanguage;
    pluginData.configurationLanguage = accessPluginModel.MappingConfigurationLanguage;

    if (accessPluginModel.MappingConfigurationLanguage == null) {
        window._mappingConfigurationLanguage = accessPluginModel.MappingDictionaryLanguage;
    }

    if (accessPluginModel.UploadMappingConfigurationID) {
        window._uploadMappingConfigurationID = accessPluginModel.UploadMappingConfigurationID;
        pluginData.uploadMappingConfigurationID = accessPluginModel.UploadMappingConfigurationID;
    }

    window._uploadMappingConfigurationLanguage = accessPluginModel.UploadMappingConfigurationLanguage;
    pluginData.uploadMappingConfigurationLanguage = accessPluginModel.UploadMappingConfigurationLanguage;

    window._uploadMappingDictionaryLanguage = accessPluginModel.UploadMappingDictionaryLanguage;
    pluginData.uploadMappingDictionaryLanguage = accessPluginModel.UploadMappingDictionaryLanguage;

    if (accessPluginModel.Port) {
        try {
            QWebChannelUtils.setPort(accessPluginModel.Port);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(e);
        }
    }

    try {
        Sentry.setContext('plugin', pluginData);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
    }

    store.dispatch({ type: 'PLUGIN/UPDATE_PLUGIN_DATA', pluginData });
};

window.accessPlugin = accessPlugin;
window.accessPluginV2 = accessPluginV2;

window._bundleResponse = '';
const getBundle = function () {
    return window._bundleResponse;
};
window.getBundle = getBundle;

ReactDOM.render((
    <Provider store={store}>
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>
    </Provider>
), document.getElementById('container'));