import React from 'react';
import styled from '@emotion/styled';

import { space, colors } from '@bim-co/componentui-foundation';

const Container = styled.div<Props>(
  ({ withNewBackgroundColor }) => `
    position: relative;
    height: calc(100vh - 59px);
    overflow-y: auto;
    margin: -11px -15px 0;
    padding: ${space[200]} ${space[100]} 0;
    ${withNewBackgroundColor ? `background: ${colors.NEUTRAL[10]};` : ''}
`
);

type Props = {
  withNewBackgroundColor?: boolean;
};

const PageContentContainer: React.FunctionComponent<Props> = ({
  children,
  withNewBackgroundColor,
  ...otherProps
}) => (
  <Container withNewBackgroundColor={withNewBackgroundColor} {...otherProps}>
    {children}
  </Container>
);

export default PageContentContainer;
