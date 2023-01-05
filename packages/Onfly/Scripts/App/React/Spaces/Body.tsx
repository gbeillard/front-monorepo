import React, { useState } from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { Loader, defaultTheme } from '@bim-co/componentui-foundation';
import { Space, SpaceWrite } from '../../Reducers/Spaces/types';

import SpacesList from './SpacesList';

import EmptyStateGlobal from '../EmptyStates';
import EmptyStates from './EmptyStates';

import DeleteConfirm from '../PropertiesSets/DeleteConfirm';
import { replaceStringByComponent } from '../../Utils/utilsResources';
import SpaceModal from './SpaceModal';
import { selectUser, selectSubDomain } from '../../Reducers/app/selectors';

type Props = {
  resources: any;
  spaces: Space[];
  subDomain: string;
  user: ReturnType<typeof selectUser>;
  searchedSpaces: Space[];
  fetchSpacesIsPending: boolean;
  fetchSpacesIsSuccess: boolean;
  fetchSpacesIsError: string;
  updateSpace: (space: SpaceWrite) => void;
  deleteSpace: (SpaceId: number) => void;
};

const Body: React.FC<Props> = ({
  resources,
  spaces,
  user,
  subDomain,
  searchedSpaces,
  fetchSpacesIsPending,
  fetchSpacesIsSuccess,
  fetchSpacesIsError,
  updateSpace,
  deleteSpace,
}) => {
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [spaceToEdit, setSpaceToEdit] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<Space>(null);

  const getDeleteModalTitle = () => {
    const title: string = resources.Spaces.DeleteSpaceModalTitle;
    const spaceName = <ModalDeleteSpaceName>{spaceToDelete?.Name}</ModalDeleteSpaceName>;

    return replaceStringByComponent(title, '[SpaceName]', spaceName);
  };

  const removeLastOccurenceOfSubdomain = (subDomainFromApi) => {
    const splitSubdomain = subDomainFromApi.split(`-${subDomain}`).slice(0, -1);

    return splitSubdomain.join(`-${subDomain}`);
  };

  const openSpaceModal = (space: Space) => {
    setIsSpaceModalOpen(true);
    setSpaceToEdit({
      ...space,
      SubDomain: removeLastOccurenceOfSubdomain(space.SubDomain),
    });
  };

  const openDeleteModal = (space: Space) => {
    setSpaceToDelete(space);
    setIsModalDeleteOpen(true);
  };

  const handleDeleteModalCancel = () => {
    setIsModalDeleteOpen(false);
  };

  const handleDeleteModalSubmit = () => {
    setIsModalDeleteOpen(false);
    deleteSpace(spaceToDelete?.Id);
  };

  /* Component states */
  // The spaces is loading
  if (fetchSpacesIsPending) {
    return <Loader />;
  }

  // Error when Spaces list is loading
  if (fetchSpacesIsError) {
    return <EmptyStateGlobal.Error />;
  }

  // The search returned no results
  if (fetchSpacesIsSuccess && spaces?.length > 0 && searchedSpaces?.length === 0) {
    return <EmptyStateGlobal.NoSearchResults />;
  }

  // list empty
  if (fetchSpacesIsSuccess && spaces?.length === 0) {
    return <EmptyStates.EmptySpacesList />;
  }

  const handleSpaceModalCancel = () => {
    setIsSpaceModalOpen(false);
  };

  const handleSpaceModalSubmit = (space: SpaceWrite) => {
    setIsSpaceModalOpen(false);

    const newSpace: SpaceWrite = {
      ...space,
      UpdatedAt: new Date(),
      UpdatedBy: {
        Id: user?.id,
        FirstName: user?.firstName,
        LastName: user?.lastName,
      },
    };

    updateSpace(newSpace);
  };

  return (
    <BodyContainer>
      <SpacesList
        resources={resources}
        spaces={searchedSpaces}
        openEditModal={openSpaceModal}
        openDeleteModal={openDeleteModal}
      />
      <DeleteConfirm
        isDisplayed={isModalDeleteOpen}
        title={getDeleteModalTitle()}
        description={resources.Spaces.DeleteSpaceModalDescription}
        submitButtonLabel={resources.MetaResource.Delete}
        onCancel={handleDeleteModalCancel}
        onSubmit={() => handleDeleteModalSubmit()}
      />
      <SpaceModal
        isOpen={isSpaceModalOpen}
        space={spaceToEdit}
        onCancel={handleSpaceModalCancel}
        onSubmit={handleSpaceModalSubmit}
      />
    </BodyContainer>
  );
};

const ModalDeleteSpaceName = styled.span`
  color: ${defaultTheme.primaryColor};
`;

const BodyContainer = styled.div`
  min-width: min-content;
  padding-bottom: 256px;
`;

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  subDomain: selectSubDomain,
});

export default connect(mapStateToProps)(Body);