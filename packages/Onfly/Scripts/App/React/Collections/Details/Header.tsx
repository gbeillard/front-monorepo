import React from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { Button } from '@bim-co/componentui-foundation';

// Selectors
import { useNavigate } from 'react-router-dom';
import { selectLanguageCode } from '../../../Reducers/app/selectors';

import { RoutePaths } from '../../Sidebar/RoutePaths';

type Props = {
  resources: any;
  languageCode: string;
  hasAccessToManageContents: boolean;
};

const Header: React.FC<Props> = ({ resources, languageCode, hasAccessToManageContents }) => {
  const navigate = useNavigate();
  return (
    <Container>
      {/* Left */}
      <FlexContainer>
        <Button icon="arrow-left" onClick={() => navigate(`/${languageCode}/collections`)}>
          {resources.MetaResource.Back}
        </Button>
      </FlexContainer>

      {/* Right */}
      <FlexContainer>
        {hasAccessToManageContents && (
          <Button
            variant="primary"
            icon="object"
            onClick={() => navigate(`/${languageCode}/${RoutePaths.ManageContents}`)}
          >
            {resources.ContentManagement.MenuItemManageContents}
          </Button>
        )}
      </FlexContainer>
    </Container>
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

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
});

export default connect(mapStateToProps)(Header);