import styled from '@emotion/styled';

export const FlexWrapper = styled.div<{ apart?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ apart }) => (apart ? 'space-between' : 'initial')};
`;