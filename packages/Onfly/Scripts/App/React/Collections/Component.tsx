import React from 'react';

import { Collection, CollectionWrite } from '../../Reducers/Collections/types';
import { AnalyticsEvent } from '../../Reducers/analytics/types';

import Header from './Header';
import Body from './Body';

type Props = {
  resources: any;
  languageCode: string;
  collections: Collection[];
  searchedCollections: Collection[];
  fetchCollectionsIsPending: boolean;
  fetchCollectionsIsSuccess: boolean;
  fetchCollectionsIsError: string;
  createCollection: (collection: CollectionWrite) => void;
  updateCollection: (collection: CollectionWrite) => void;
  deleteCollection: (collectionId: number) => void;
  setCollectionsSearch: (search: string) => void;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const Component: React.FC<Props> = ({
  resources,
  languageCode,
  collections,
  searchedCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  fetchCollectionsIsPending,
  fetchCollectionsIsSuccess,
  fetchCollectionsIsError,
  setCollectionsSearch,
  sendAnalytics,
}) => (
  <>
    <Header
      resources={resources}
      languageCode={languageCode}
      setCollectionsSearch={setCollectionsSearch}
      createCollection={createCollection}
      sendAnalytics={sendAnalytics}
    />
    <Body
      resources={resources}
      collections={collections}
      searchedCollections={searchedCollections}
      updateCollection={updateCollection}
      deleteCollection={deleteCollection}
      fetchCollectionsIsPending={fetchCollectionsIsPending}
      fetchCollectionsIsSuccess={fetchCollectionsIsSuccess}
      fetchCollectionsIsError={fetchCollectionsIsError}
      sendAnalytics={sendAnalytics}
    />
  </>
);

export default Component;