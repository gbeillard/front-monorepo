import React from 'react';
import styled from '@emotion/styled';

import { defaultTheme, space, Paragraph, colors } from '@bim-co/componentui-foundation';

type Props = {
  open?: boolean;
  message?: string;
};

const Toolbar: React.FunctionComponent<Props> = ({ children, open, message }) =>
  open && (
    <Container>
      <Paragraph nowrap>{message}</Paragraph>
      <FlexContainer>{children}</FlexContainer>
    </Container>
  );

const FlexContainer = styled.div`
  display: flex;
`;

const Container = styled(FlexContainer)`
  z-index: 20;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 50px;
  justify-content: space-between;
  align-items: center;
  height: ${space[350]};
  border-top: solid ${space[6]} ${colors.BM[10]};
  background-color: ${defaultTheme.backgroundColor};
  filter: drop-shadow(0px 2px 16px ${colors.BM[90]}29); //29 = 0.16 alpha (opacity)
  padding: ${space[50]} ${space[700]} ${space[50]} ${space[200]};
`;

export default Toolbar;