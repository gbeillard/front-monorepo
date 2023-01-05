import React from 'react';
import MUIDialog, { DialogProps } from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core';

const SmallDialog = withStyles({
  paper: {
    padding: '32px 64px',
    maxHeight: '80vh',
  },
})(MUIDialog);

const MediumDialog = withStyles({
  paper: {
    padding: '32px 64px',
    height: '80vh',
    maxHeight: '80vh',
  },
})(MUIDialog);

const LargeDialog = withStyles({
  root: {
    zIndex: '2100 !important' as unknown as number,
  },
  paper: {
    padding: '32px 64px',
    height: '95vh',
    maxHeight: '95vh',
  },
})(MUIDialog);

type Props = DialogProps & { size?: 'small' | 'medium' | 'large' };
const Dialog: React.FC<Props> = ({ size = 'small', ...props }) => {
  switch (size) {
    case 'small':
      return <SmallDialog {...props} />;
    case 'medium':
      return <MediumDialog {...props} />;
    case 'large':
      return <LargeDialog {...props} />;
    default:
      return null;
  }
};

export default Dialog;