import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

/* Types */
import { useParams } from 'react-router-dom';
import { Collection } from '../../../Reducers/Collections/types';

/* Selectors */
import {
  selectTranslatedResources,
  selectLanguageCode,
  selectRole,
  selectIsBoostOffer,
} from '../../../Reducers/app/selectors';

import {
  selectCollection,
  selectFetchCollectionIsSuccess,
  selectFetchCollectionIsError,
  selectFetchCollectionIsPending,
} from '../../../Reducers/Collections/selectors';

import { Authorizations, globalAuthorizations } from '../../Sidebar/authorizations';

/* Actions */
import { setPageTitle as setPageTitleAction } from '../../../Reducers/app/actions';

import { fetchCollection as fetchCollectionAction } from '../../../Reducers/Collections/actions';

import Page from '../../CommonsElements/PageContentContainer';
import Component from './Component';

type Props = {
  resources: any;
  languageCode: any;
  role: ReturnType<typeof selectRole>;
  collection: Collection;
  fetchCollectionIsSuccess: boolean;
  fetchCollectionIsError: string;
  fetchCollectionIsPending: boolean;
  isBoostOffer: boolean;
  setPageTitle: (title: string) => void;
  fetchCollection: (collectionId: number) => void;
};

const CollectionDetails: React.FC<Props> = ({
  resources,
  languageCode,
  role,
  collection,
  fetchCollectionIsSuccess,
  fetchCollectionIsError,
  fetchCollectionIsPending,
  isBoostOffer,
  setPageTitle,
  fetchCollection,
}) => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const hasAccessToManageContents = (globalAuthorizations[role?.key] as Authorizations)?.contents
    ?.enableManageContents;

  useEffect(() => {
    // Load collection
    if (!isNaN(parseInt(collectionId))) {
      fetchCollection(parseInt(collectionId));
    }
  }, []);

  useEffect(() => {
    // Page title
    let pageTitle = resources.ContentManagementCollections.DetailsPageTitle;

    if (fetchCollectionIsSuccess && pageTitle && collection) {
      pageTitle = pageTitle.replace('[CollectionName]', collection.Name);

      setPageTitle(pageTitle as string);
    } else if (fetchCollectionIsError) {
      // Error when collection is loading
      setPageTitle(
        resources.ContentManagementCollectionsEmptyState.CollectionDoesNotExistTitle as string
      );
    }
  }, [languageCode, fetchCollectionIsSuccess, fetchCollectionIsError]);

  return (
    <Page withNewBackgroundColor>
      <Component
        resources={resources}
        hasAccessToManageContents={hasAccessToManageContents}
        collection={collection}
        fetchCollectionIsPending={fetchCollectionIsPending}
        fetchCollectionIsError={fetchCollectionIsError}
        isBoostOffer={isBoostOffer}
      />
    </Page>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setPageTitle: (title: string) => dispatch(setPageTitleAction(title)),
  fetchCollection: (collectionId: number) => dispatch(fetchCollectionAction(collectionId)),
});

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  role: selectRole,
  collection: selectCollection,
  fetchCollectionIsSuccess: selectFetchCollectionIsSuccess,
  fetchCollectionIsError: selectFetchCollectionIsError,
  fetchCollectionIsPending: selectFetchCollectionIsPending,
  isBoostOffer: selectIsBoostOffer,
});

export default connect(mapSelectToProps, mapDispatchToProps)(CollectionDetails);