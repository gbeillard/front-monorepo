import React from 'react';
import styled from '@emotion/styled';
import { Button, space } from '@bim-co/componentui-foundation';

const getIcon = (hasChildren, expanded) => {
  if (!hasChildren) {
    return;
  }

  return expanded ? 'chevron-down' : 'chevron-right';
};

const Arrow = ({ hasChildren, expanded, onClick, selected }) => {
  const icon = getIcon(hasChildren, expanded);
  return icon ? (
    <PlacedButton
      selected={selected}
      variant="alternative"
      size="dense"
      icon={icon}
      onClick={onClick}
    />
  ) : (
    <Placeholder />
  );
};

const PlacedButton = styled(Button)(
  ({ isSelected }) => `
   margin-left: ${isSelected ? `-${space[50]}` : space[0]};
`
);

const Placeholder = styled.div`
  width: ${space[150]};
  height: ${space[150]};
`;

export default Arrow;