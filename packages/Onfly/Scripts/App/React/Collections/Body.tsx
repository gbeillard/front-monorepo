import React, { useState } from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';

import { Loader, defaultTheme } from '@bim-co/componentui-foundation';
import { Collection, CollectionWrite } from '../../Reducers/Collections/types';
import { AnalyticsEvent } from '../../Reducers/analytics/types';

import CollectionsList from './CollectionsList';
import DeleteConfirm from '../PropertiesSets/DeleteConfirm';

import { replaceStringByComponent } from '../../Utils/utilsResources';

import CollectionModal from './CollectionModal';

import EmptyStateGlobal from '../EmptyStates';

import { selectUser } from '../../Reducers/app/selectors';

type Props = {
  resources: any;
  user: ReturnType<typeof selectUser>;
  collections: Collection[];
  searchedCollections: Collection[];
  fetchCollectionsIsPending: boolean;
  fetchCollectionsIsSuccess: boolean;
  fetchCollectionsIsError: string;
  updateCollection: (collection: CollectionWrite) => void;
  deleteCollection: (collectionId: number) => void;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const Body: React.FC<Props> = ({
  resources,
  user,
  collections,
  searchedCollections,
  fetchCollectionsIsPending,
  fetchCollectionsIsSuccess,
  fetchCollectionsIsError,
  updateCollection,
  deleteCollection,
  sendAnalytics,
}) => {
  /* Component states */
  // The collections is loading
  if (fetchCollectionsIsPending) {
    return <Loader />;
  }

  // Error when collections list is loading
  if (fetchCollectionsIsError) {
    return <EmptyStateGlobal.Error />;
  }

  // The search returned no results
  if (fetchCollectionsIsSuccess && collections?.length > 0 && searchedCollections?.length === 0) {
    return <EmptyStateGlobal.NoSearchResults />;
  }

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection>(null);

  const openDeleteModal = (collection: Collection) => {
    setCollectionToDelete(collection);
    setIsModalDeleteOpen(true);
  };

  const handleDeleteModalCancel = () => {
    setIsModalDeleteOpen(false);
  };

  const handleDeleteModalSubmit = () => {
    setIsModalDeleteOpen(false);
    deleteCollection(collectionToDelete?.Id);
  };

  const getDeleteModalTitle = () => {
    const title: string = resources.ContentManagementCollections.DeleteCollectionModalTitle;
    const collectionName = (
      <ModalDeleteCollectionName>{collectionToDelete?.Name}</ModalDeleteCollectionName>
    );

    return replaceStringByComponent(title, '[CollectionName]', collectionName);
  };

  const openCollectionModal = (collection: Collection) => {
    setIsCollectionModalOpen(true);
    setCollectionToEdit(collection);
  };

  const handleCollectionModalCancel = () => {
    setIsCollectionModalOpen(false);
  };

  const handleCollectionModalSubmit = (collection: CollectionWrite) => {
    setIsCollectionModalOpen(false);

    const newCollection: CollectionWrite = {
      ...collection,
      UpdatedAt: new Date(moment().format()),
      UpdatedBy: {
        Id: user?.id,
        FirstName: user?.firstName,
        LastName: user?.lastName,
      },
    };

    updateCollection(newCollection);
  };

  return (
    <BodyContainer>
      <CollectionsList
        resources={resources}
        collections={searchedCollections}
        openDeleteModal={openDeleteModal}
        openEditModal={openCollectionModal}
        sendAnalytics={sendAnalytics}
      />
      <DeleteConfirm
        isDisplayed={isModalDeleteOpen}
        title={getDeleteModalTitle()}
        description={resources.ContentManagementCollections.DeleteCollectionModalDescription}
        submitButtonLabel={resources.MetaResource.Delete}
        onCancel={handleDeleteModalCancel}
        onSubmit={() => handleDeleteModalSubmit()}
      />
      <CollectionModal
        isOpen={isCollectionModalOpen}
        collection={collectionToEdit}
        onCancel={handleCollectionModalCancel}
        onSubmit={handleCollectionModalSubmit}
      />
    </BodyContainer>
  );
};

const BodyContainer = styled.div`
  min-width: min-content;
  padding-bottom: 256px;
`;

const ModalDeleteCollectionName = styled.span`
  color: ${defaultTheme.primaryColor};
`;

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(Body);