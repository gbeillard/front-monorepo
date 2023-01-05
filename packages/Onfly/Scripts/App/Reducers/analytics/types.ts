export const SEND_ANALYTICS = 'ANALYTICS/SEND_ANALYTICS';

export type SendAnalyticsAction = {
  type: typeof SEND_ANALYTICS;
  data: AnalyticsData;
};

export enum AnalyticsEvent {
  UserVisitedHomePage = 'user-visited-homepage',
  UserOpenedSidebar = 'user-opened-sidebar',
  UserClosedSidebar = 'user-closed-sidebar',
  UserSelectedProperty = 'user-selected-property',
  UserSelectedPropertyValue = 'user-selected-property-value',
  UserClickedContentDownloadContent = 'user-clicked-download-content',
  UserOpenedCollection = 'user-opened-collection',
  UserCreatedCollection = 'user-created-collection',
  UserAddedObjectToCollection = 'user-added-object-to-collection',
  UserOpenedChat = 'user-opened-chat',
  UserClickedDocumentationMenu = 'user-clicked-documentation-menu',
  UserClickedReportBugMenu = 'user-clicked-report-bug-menu',
  UserClickedViewBugsMenu = 'user-clicked-view-bugs-menu',
}

export type AnalyticsData = {
  event: AnalyticsEvent;
  [keys: string]: any;
};