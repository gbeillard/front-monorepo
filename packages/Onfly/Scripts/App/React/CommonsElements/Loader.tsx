import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

import { space, Icon } from '@bim-co/componentui-foundation';

const Loader: React.FunctionComponent = () => (
  <LoaderWrapper>
    <Icon icon="loader" size="l" />
  </LoaderWrapper>
);

// Loading animation
const spin = keyframes`
    from {
       transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${space[300]};
  > * {
    animation: ${spin} 1s ease infinite;
  }
`;

export default Loader;