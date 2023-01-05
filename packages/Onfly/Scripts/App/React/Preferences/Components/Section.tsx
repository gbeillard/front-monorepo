import React from 'react';
import styled from '@emotion/styled';

import { space, H2 } from '@bim-co/componentui-foundation';

type Props = {
  title: string;
};

const Section: React.FC<Props> = ({ title, children }) => (
  <SectionContainer>
    <H2>{title}</H2>
    {children}
  </SectionContainer>
);

const SectionContainer = styled.div`
  padding-top: ${space[200]};
  padding-bottom: ${space[150]};
`;

export default Section;