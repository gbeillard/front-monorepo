import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = DialogProps & {
  left: ReactNode;
  right: ReactNode;
  showRight?: boolean;
  open?: boolean;
  onClose: () => void;
  isLoading: boolean;
};

const StyledDialog = withStyles({
  paper: {
    minHeight: '80vh',
  },
})(Dialog);

const Wrapper = styled.div<{ isLoading?: boolean }>(({ isLoading }) => ({
  display: 'flex',
  backgroundColor: 'white',
  height: '80vh',
  justifyContent: isLoading ? 'center' : 'none',
}));

export const Left = styled.div({
  flexGrow: 1,
  backgroundColor: 'white',
  maxWidth: '100%',
  overflowY: 'auto',
});
export const Right = styled.div<{ show?: boolean }>(({ show }) => ({
  width: show ? '33%' : 0,
  borderLeft: show ? '1px solid #E7E9F1' : '',
  backgroundColor: '#F9FAFC',
  transition:
    'width 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
  maxWidth: '336px',
  opacity: show ? 1 : 0,
  overflowX: show ? 'auto' : 'hidden',
  overflowY: 'auto',
}));

const LoaderContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const DialogWithRecap: React.FC<Props> = ({ left, right, showRight, isLoading, ...props }) => (
  <StyledDialog fullWidth maxWidth="lg" {...props}>
    <Wrapper isLoading={isLoading}>
      {isLoading ? (
        <LoaderContainer>
          <CircularProgress size={75} />
        </LoaderContainer>
      ) : (
        <>
          <Left>{left}</Left>
          <Right show={showRight}>{right}</Right>
        </>
      )}
    </Wrapper>
  </StyledDialog>
);

export default DialogWithRecap;
