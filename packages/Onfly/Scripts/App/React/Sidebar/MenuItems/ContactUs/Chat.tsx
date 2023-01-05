/* eslint-disable @typescript-eslint/dot-notation */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { sendAnalytics as sendAnalyticsAction } from '../../../../Reducers/analytics/actions';
import { AnalyticsEvent } from '../../../../Reducers/analytics/types';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  resources: any;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const Chat: React.FC<Props> = ({ resources, sendAnalytics }) => {
  const handleClickChat = () => {
    if (window['$crisp'].is('chat:closed')) {
      sendAnalytics(AnalyticsEvent.UserOpenedChat);
    }

    window['$crisp'].push(['do', 'chat:show']);
    window['$crisp'].push(['do', 'chat:open']);
  };

  return <MenuItem name={resources.ContentManagement.MenuItemChat} handleClick={handleClickChat} />;
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch) => ({
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);