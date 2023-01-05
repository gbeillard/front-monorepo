import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { initialize as initializeAction, Tags as OCTags } from '@bim-co/onfly-connect';
import { InitializeOptions } from '@bim-co/onfly-connect/Global';
import { sendAnalytics as sendAnalyticsAction } from '../../Reducers/analytics/actions';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
  selectRole,
} from '../../Reducers/app/selectors';
import { LanguageCode } from '../../Reducers/app/types';
import { AnalyticsEvent } from '../../Reducers/analytics/types';

import { API_URL } from '../../Api/constants';

type Props = {
  onflyId: number;
  token: string;
  language: LanguageCode;
  resources: any;
  initialize: (config: any) => void;
};

const Tags: React.FC<Props> = ({ onflyId, token, language, resources, initialize }) => {
  const apiKey = localStorage.getItem('ApiKey');

  useEffect(() => {
    const config = {
      onflyId,
      apiKey,
      token,
      language,
      resources,
      apiUrl: API_URL,
    };

    initialize(config);
  }, [apiKey, initialize, language, resources, onflyId, token]);

  return <OCTags />;
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  token: selectToken,
  language: selectLanguageCode,
  resources: selectTranslatedResources,
  role: selectRole,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initializeAction(config)),
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Tags));
