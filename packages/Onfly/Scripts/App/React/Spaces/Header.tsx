import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

// Selectors
import { Button, TextField, Tooltip } from '@bim-co/componentui-foundation';
import { selectRole, selectSettings } from '../../Reducers/app/selectors';
import SpaceModal from './SpaceModal';
import { Space, SpaceWrite } from '../../Reducers/Spaces/types';
import {
  selectCreateSpaceIsPending,
  selectCreateSpaceIsSuccess,
} from '../../Reducers/Spaces/selectors';
import { RoleKey } from '../../Reducers/Roles/types';

export type Props = {
  role: any;
  resources: any;
  spaces: Space[];
  settings: any;
  setSpacesSearch: (search: string) => void;
  createSpaceIsPending;
  createSpaceIsSuccess;
  createSpace;
  fetchSpacesIsSuccess: boolean;
};

const Header: React.FC<Props> = ({
  role,
  resources,
  settings,
  setSpacesSearch,
  fetchSpacesIsSuccess,
  createSpace,
  createSpaceIsPending,
  createSpaceIsSuccess,
  spaces,
}) => {
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);

  useEffect(() => {
    if (createSpaceIsSuccess && isSpaceModalOpen) {
      setIsSpaceModalOpen(false);
    }
  }, [createSpaceIsSuccess]);

  const canCreateSpaces = settings.MaxSpaceNumber === -1 || settings.MaxSpaceNumber > spaces.length;
  let timeoutId = null;

  const handleSearchSpaces = (event) => {
    const search: string = event.currentTarget.value;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => setSpacesSearch(search), 500);
  };

  const handleSpaceModalCancel = () => {
    setIsSpaceModalOpen(false);
  };
  const handleSpaceModalSubmit = (space: SpaceWrite) => {
    createSpace(space);
  };
  return (
    <>
      <Container>
        {/* Left */}
        <FlexContainer>
          {fetchSpacesIsSuccess && spaces.length !== 0 && (
            <SearchBarContainer>
              <TextField
                iconLeft="search"
                placeholder={resources.Spaces.SearchSpace}
                onChange={(event) => handleSearchSpaces(event)}
              />
            </SearchBarContainer>
          )}
        </FlexContainer>
        {/* Right */}
        <FlexContainer>
          {role.key === RoleKey.admin && fetchSpacesIsSuccess && (
            <Tooltip
              placement="left"
              renderValue={() => (
                <TooltipText>{resources.Spaces.ReachedMaxSpacesNumber}</TooltipText>
              )}
              isVisible={canCreateSpaces ? false : undefined}
            >
              <Button
                variant="secondary"
                icon="create"
                onClick={() => {
                  setIsSpaceModalOpen(true);
                }}
                isDisabled={!canCreateSpaces}
              >
                {resources.Spaces.CreateSpace}
              </Button>
            </Tooltip>
          )}
        </FlexContainer>
      </Container>
      <SpaceModal
        isOpen={isSpaceModalOpen}
        isLoading={createSpaceIsPending}
        onCancel={handleSpaceModalCancel}
        onSubmit={handleSpaceModalSubmit}
      />
    </>
  );
};

const FlexContainer = styled.div`
  display: flex;
`;

const SearchBarContainer = styled.div`
  width: 320px;
  margin: 0 8px;
`;

const Container = styled(FlexContainer)`
  justify-content: space-between;
  margin-bottom: 16px;
  padding-top: 20px;
`;

const TooltipText = styled.div`
  padding: 16px;
  max-width: 320px;
`;

const mapStateToProps = createStructuredSelector({
  role: selectRole,
  settings: selectSettings,
  createSpaceIsPending: selectCreateSpaceIsPending,
  createSpaceIsSuccess: selectCreateSpaceIsSuccess,
});
export default connect(mapStateToProps)(Header);