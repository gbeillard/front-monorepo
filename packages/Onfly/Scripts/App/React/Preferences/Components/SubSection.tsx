import React from 'react';
import styled from '@emotion/styled';

import { space, H3, defaultTheme, GridLayout, GridItem, P } from '@bim-co/componentui-foundation';

type Props = {
  title: string;
  description: string;
  /**
   *  Grid column start for action wrapper
   *  Default = 1
   * */
  start?: number;
  /** Grid column end for action wrapper */
  end?: number;
};

const SubSection: React.FC<Props> = ({ title, description, start = 1, end, children }) => (
  <>
    <SectionTitle>{title}</SectionTitle>
    <GridLayout>
      <ActionWrapper start={start} end={end}>
        {children}
      </ActionWrapper>
    </GridLayout>
    <Paragraph>{description}</Paragraph>
  </>
);

const SectionTitle = styled(H3)`
  margin-top: ${space[200]};
  color: ${defaultTheme.textColorSecondary};
`;

const ActionWrapper = styled(GridItem)`
  margin-top: ${space[100]};
  margin-bottom: ${space[100]};
`;

const Paragraph = styled(P)`
  color: ${defaultTheme.textColorTertiary};
`;

export default SubSection;