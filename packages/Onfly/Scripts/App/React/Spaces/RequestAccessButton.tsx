import React, { useState } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../../Reducers/app/selectors';
import { Space } from '../../Reducers/Spaces/types';

import {
  askAuthorization as askAuthorizationAction,
  updateStatus as updateStatusAction,
} from '../../Reducers/Spaces/actions';

import { defaultTheme, P, Button, } from '@bim-co/componentui-foundation';
import { SpacesStatus } from '../../Reducers/Spaces/constants';

type Props = {
  space: Space;
  resources: any;
  askAuthorization: (spaceId: number) => void;
  updateStatus: (space: Space, status: SpacesStatus) => void;
};

const RequestAccessButton: React.FC<Props> = ({
  space,
  resources,
  askAuthorization,
  updateStatus,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>();

  // l'utilisateur n'est pas dans l'espace
  if (!space.Role) {
    // l'utilisateur a déjà fais une demande d'accès
    if (space.AccessRequest) {
      return (
        <ParagraphCheck color={defaultTheme.status.confirmTextColor}>{resources.Spaces.AskAuthorizationSend}</ParagraphCheck>
      );
    }

    const handleClickAskAuthorization = () => {
      setIsLoading(true);
      updateStatus(space, SpacesStatus.RequestAccessSend);
      askAuthorization(space.Id);
    };

    return (
      <Button
        variant="primary"
        size="medium"
        onClick={handleClickAskAuthorization}
        isLoading={isLoading}
      >
        {resources.Spaces.AskAuthorization}
      </Button>
    );
  }

  return null;
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch) => ({
  askAuthorization: (spaceId) => dispatch(askAuthorizationAction(spaceId)),
  updateStatus: (space: Space, status: SpacesStatus) => dispatch(updateStatusAction(space, status)),
});

const ParagraphCheck = styled(P)`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export default connect(mapStateToProps, mapDispatchToProps)(RequestAccessButton);