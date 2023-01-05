import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import toastr from 'toastr';

/* Types */
import { Collection, CollectionWrite } from '../../Reducers/Collections/types';
import { AnalyticsEvent } from '../../Reducers/analytics/types';

/* Actions */
import {
  fetchCollections as fetchCollectionsAction,
  createCollection as createCollectionAction,
  updateCollection as updateCollectionAction,
  deleteCollection as deleteCollectionAction,
  setCollectionsSearch as setCollectionsSearchAction,
} from '../../Reducers/Collections/actions';

import { sendAnalytics as sendAnalyticsAction } from '../../Reducers/analytics/actions';

/* Selectors */
import { selectTranslatedResources, selectLanguageCode } from '../../Reducers/app/selectors';

import {
  selectCollections,
  selectCreateCollectionIsError,
  selectSearchedCollections,
  selectFetchCollectionsIsPending,
  selectFetchCollectionsIsSuccess,
  selectFetchCollectionsIsError,
  selectDeleteCollectionIsError,
  selectUpdateCollectionIsError,
} from '../../Reducers/Collections/selectors';

/* Components */
import Page from '../CommonsElements/PageContentContainer';
import Component from './Component';

type Props = {
  resources: any;
  languageCode: string;
  collections: Collection[];
  searchedCollections: Collection[];
  fetchCollectionsIsPending: boolean;
  fetchCollectionsIsSuccess: boolean;
  fetchCollectionsIsError: string;
  deleteCollectionIsError: string;
  createCollectionIsError: string;
  updateCollectionIsError: string;
  fetchCollections: () => void;
  createCollection: (collection: CollectionWrite) => void;
  updateCollection: (collection: CollectionWrite) => void;
  deleteCollection: (collectionId: number) => void;
  setCollectionsSearch: (search: string) => void;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const Collections: React.FC<Props> = ({
  // mapSelectToProps
  resources,
  languageCode,
  collections,
  searchedCollections,
  fetchCollectionsIsPending,
  fetchCollectionsIsSuccess,
  fetchCollectionsIsError,
  deleteCollectionIsError,
  createCollectionIsError,
  updateCollectionIsError,
  // mapDispatchToProps
  fetchCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  setCollectionsSearch,
  sendAnalytics,
}) => {
  useEffect(() => {
    // Reset search
    setCollectionsSearch('');

    // Load collections
    fetchCollections();
  }, [languageCode]);

  /* Error handler */

  useEffect(() => {
    // Delete collection failed
    if (deleteCollectionIsError) {
      toastr.error(
        resources.ContentManagementCollections.DeleteCollectionFailed,
        deleteCollectionIsError
      );
    }
  }, [deleteCollectionIsError]);

  useEffect(() => {
    // Create collection failed
    if (createCollectionIsError) {
      toastr.error(
        resources.ContentManagementCollections.CreateCollectionFailed,
        createCollectionIsError
      );
    }
  }, [createCollectionIsError]);

  useEffect(() => {
    // Update collection failed
    if (updateCollectionIsError) {
      toastr.error(
        resources.ContentManagementCollections.UpdateCollectionFailed,
        updateCollectionIsError
      );
    }
  }, [updateCollectionIsError]);

  return (
    <Page withNewBackgroundColor>
      <Component
        resources={resources}
        languageCode={languageCode}
        collections={collections}
        searchedCollections={searchedCollections}
        createCollection={createCollection}
        updateCollection={updateCollection}
        deleteCollection={deleteCollection}
        fetchCollectionsIsPending={fetchCollectionsIsPending}
        fetchCollectionsIsSuccess={fetchCollectionsIsSuccess}
        fetchCollectionsIsError={fetchCollectionsIsError}
        setCollectionsSearch={setCollectionsSearch}
        sendAnalytics={sendAnalytics}
      />
    </Page>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  collections: selectCollections,
  searchedCollections: selectSearchedCollections,
  fetchCollectionsIsPending: selectFetchCollectionsIsPending,
  fetchCollectionsIsSuccess: selectFetchCollectionsIsSuccess,
  fetchCollectionsIsError: selectFetchCollectionsIsError,
  deleteCollectionIsError: selectDeleteCollectionIsError,
  createCollectionIsError: selectCreateCollectionIsError,
  updateCollectionIsError: selectUpdateCollectionIsError,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCollections: () => dispatch(fetchCollectionsAction()),
  createCollection: (collection: CollectionWrite) => dispatch(createCollectionAction(collection)),
  updateCollection: (collection: CollectionWrite) => dispatch(updateCollectionAction(collection)),
  deleteCollection: (collectionId: number) => dispatch(deleteCollectionAction(collectionId)),
  setCollectionsSearch: (search: string) => dispatch(setCollectionsSearchAction(search)),
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

export default connect(mapSelectToProps, mapDispatchToProps)(Collections);