import { takeLatest } from 'redux-saga/effects';
import { SendAnalyticsAction, SEND_ANALYTICS } from './types';

export function* sendAnalytics({ data }: SendAnalyticsAction) {
  dataLayer.push(data);
}

const sagas = [takeLatest(SEND_ANALYTICS, sendAnalytics)];

export default sagas;