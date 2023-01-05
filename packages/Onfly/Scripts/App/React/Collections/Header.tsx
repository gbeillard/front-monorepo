import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { Button, TextField } from '@bim-co/componentui-foundation';
import { CollectionWrite } from '../../Reducers/Collections/types';
import { AnalyticsEvent } from '../../Reducers/analytics/types';
import { RoutePaths } from '../Sidebar/RoutePaths';

// Selectors
import { selectRole } from '../../Reducers/app/selectors';
import CollectionModal from './CollectionModal';
import {
  selectCreateCollectionIsPending,
  selectCreateCollectionIsSuccess,
} from '../../Reducers/Collections/selectors';
import { history } from '../../history';

type Props = {
  resources: any;
  languageCode: string;
  role: any;
  createCollectionIsPending: boolean;
  createCollectionIsSuccess: boolean;
  setCollectionsSearch: (search: string) => void;
  createCollection: (collection: CollectionWrite) => void;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const Header: React.FC<Props> = ({
  resources,
  languageCode,
  role,
  createCollectionIsPending,
  createCollectionIsSuccess,
  setCollectionsSearch,
  createCollection,
  sendAnalytics,
}) => {
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  useEffect(() => {
    if (createCollectionIsSuccess && isCollectionModalOpen) {
      setIsCollectionModalOpen(false);
      history.push(`/${languageCode}/${RoutePaths.ManageContents}`, {
        message: resources.ContentManagementCollections.CreateCollectionSuccess,
      });
    }
  }, [createCollectionIsSuccess]);

  const handleCollectionModalCancel = () => {
    setIsCollectionModalOpen(false);
  };

  const handleCollectionModalSubmit = (collection: CollectionWrite) => {
    createCollection(collection);
    sendAnalytics(AnalyticsEvent.UserCreatedCollection);
  };

  let timeoutId = null;

  const handleSearchCollections = (event) => {
    const search: string = event.currentTarget.value;

    if (timeoutId !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => setCollectionsSearch(search), 500);
  };

  return (
    <>
      <Container>
        {/* Left */}
        <FlexContainer>
          <SearchBarContainer>
            <TextField
              iconLeft="search"
              placeholder={resources.ContentManagementCollections.Search}
              onChange={(event) => handleSearchCollections(event)}
            />
          </SearchBarContainer>
        </FlexContainer>

        {/* Right */}
        <FlexContainer>
          {role?.key === 'admin' && (
            <Button
              variant="secondary"
              icon="create"
              onClick={() => setIsCollectionModalOpen(true)}
            >
              {resources.ContentManagementCollections.CreateCollection}
            </Button>
          )}
        </FlexContainer>
      </Container>
      <CollectionModal
        isOpen={isCollectionModalOpen}
        isLoading={createCollectionIsPending}
        onCancel={handleCollectionModalCancel}
        onSubmit={handleCollectionModalSubmit}
      />
    </>
  );
};

const FlexContainer = styled.div`
  display: flex;
`;

const Container = styled(FlexContainer)`
  justify-content: space-between;
  margin-bottom: 16px;
  padding-top: 20px;
`;

const SearchBarContainer = styled.div`
  width: 320px;
  margin: 0 8px;
`;

const mapStateToProps = createStructuredSelector({
  role: selectRole,
  createCollectionIsPending: selectCreateCollectionIsPending,
  createCollectionIsSuccess: selectCreateCollectionIsSuccess,
});

export default connect(mapStateToProps)(Header);