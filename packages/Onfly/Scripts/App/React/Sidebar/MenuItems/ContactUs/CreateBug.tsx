import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { sendAnalytics as sendAnalyticsAction } from '../../../../Reducers/analytics/actions';
import { AnalyticsEvent } from '../../../../Reducers/analytics/types';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  groupId: number;
  languageCode: string;
  resources: any;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const CreateBug: React.FC<Props> = ({ groupId, languageCode, resources, sendAnalytics }) => (
  <MenuItem
    link={
      groupId === 0 ? `/${languageCode}/bugtrack` : `/${languageCode}/group/${groupId}/bugtrack`
    }
    name={resources.BugTracker.MenuItemReport}
    handleClick={() => sendAnalytics(AnalyticsEvent.UserClickedReportBugMenu)}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch) => ({
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateBug);