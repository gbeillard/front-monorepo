import React from 'react';
import styled from '@emotion/styled';

import { H1, P, space, defaultTheme } from '@bim-co/componentui-foundation';

type Props = {
  title: string;
  description: string;
};

const Header: React.FC<Props> = ({ title, description }) => (
  <>
    <H1>{title}</H1>
    <HeaderParagraph>{description}</HeaderParagraph>
  </>
);

const HeaderParagraph = styled(P)`
  color: ${defaultTheme.textColorSecondary};
  margin-top: ${space[50]};
`;

export default Header;