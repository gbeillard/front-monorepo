import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as QWebChannelUtils from '../../../Utils/qwebchannelUtils.js';

import ChooseMapping from './ChooseMapping.jsx';
import { selectIsCommunityUser } from '../../../Reducers/app/selectors.js';
import { fetchPreferences as fetchPreferencesAction } from '../../../Reducers/preferences/actions';

// import DUMMY_DATA from "./UploadComponentDummyData";

const Loader = ({ text }) => (
  <div id="loader-spinner" className="loader-page-empty full-page">
    <CircularProgress />
    {text && <div className="left-10">{text}</div>}
  </div>
);

// /!\ do not remove /!\
// this function is executed one time on loading and not even more. Used to check, find chat and hide it
const checkExist = setInterval(() => {
  if (
    // eslint-disable-next-line no-underscore-dangle
    window._isPlugin &&
    document.getElementsByClassName('crisp-client').length &&
    document.getElementsByClassName('crisp-client')[0] !== null &&
    document.getElementsByClassName('crisp-client')[0].classList !== null
  ) {
    document.getElementsByClassName('crisp-client')[0].classList.add('hidden');
    clearInterval(checkExist);
  }
}, 500);

const UploadComponent = ({
  language,
  objectsList,
  defaultMappingLoaded,
  uploadInProgress,
  resources,
  setBundles,
  cancelUpload, // props venant de mapDispatchToProps
  fetchPreferences,
}) => {
  useEffect(() => {
    if (document.getElementsByClassName('crisp-client')[0] !== undefined) {
      document.querySelector('body').classList.add('crisp-ascend');
      document.getElementsByClassName('crisp-client')[0].classList.add('hidden');
    }
    // uncomment if you want to get local debbugging at /upload-object/mapping
    // setBundles(DUMMY_DATA, language);

    fetchPreferences();

    return () => {
      document.querySelector('body').classList.remove('crisp-ascend');
    };
  }, []);

  const closeUI = () => {
    QWebChannelUtils.sendMessage({ Category: 'CancelUpload', Action: 'set', Data: null });
    cancelUpload();
  };

  if (objectsList.length > 0 && defaultMappingLoaded && !uploadInProgress) {
    return <ChooseMapping closeUI={closeUI} />;
  }

  if (!defaultMappingLoaded && !uploadInProgress) {
    return <Loader text={resources.UploadObject.SearchBestMapping} />;
  }

  return <Loader />;
};

const mapDispatchToProps = (dispatch) => ({
  setBundles: (data, language) => dispatch({ type: 'setBundles', data, language }),
  cancelUpload: () => dispatch({ type: 'cancelUpload' }),
  fetchPreferences: () => dispatch(fetchPreferencesAction()),
});

const mapStateToProps = (store) => {
  const { appState } = store;
  const { page, objectsList, defaultMappingLoaded, uploadInProgress } = appState;
  return {
    page,
    objectsList,
    uploadInProgress,
    defaultMappingLoaded,
    language: appState.Language,
    resources: appState.Resources[appState.Language],
    isCommunityUser: selectIsCommunityUser(store),
    TemporaryToken: appState.TemporaryToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadComponent);
