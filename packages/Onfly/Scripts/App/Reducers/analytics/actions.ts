import { AnalyticsEvent, SendAnalyticsAction, SEND_ANALYTICS } from './types';

export const sendAnalytics = (event: AnalyticsEvent, keys?: any): SendAnalyticsAction => ({
  type: SEND_ANALYTICS,
  data: {
    event,
    ...keys,
  },
});