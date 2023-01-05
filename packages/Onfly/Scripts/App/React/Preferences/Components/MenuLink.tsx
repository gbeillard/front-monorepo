import React from 'react';
import styled from '@emotion/styled';

import { defaultTheme, A, colors } from '@bim-co/componentui-foundation';

type Props = {
  isActive: boolean;
  onClick: () => void;
};

const MenuLink: React.FC<Props> = ({ isActive, onClick, children }) => (
  <div>
    <Link isActive={isActive} color={!isActive && colors.NEUTRAL[70]} onClick={onClick}>
      {children}
    </Link>
  </div>
);

const Link = styled(A)<Props>(
  ({ isActive }) => `
    ${isActive && `font-weight: ${defaultTheme.boldWeight}`};
`
);

export default MenuLink;