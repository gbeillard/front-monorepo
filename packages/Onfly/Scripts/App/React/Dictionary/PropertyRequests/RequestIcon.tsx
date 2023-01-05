import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { withStyles } from '@material-ui/core';

import MuiCheckIcon from '@material-ui/icons/Check';
import SendIcon from '@material-ui/icons/Send';
import BrokenIcon from '@material-ui/icons/BrokenImage';
import MuiRejectedIcon from '@material-ui/icons/HighlightOff';

import { createStructuredSelector } from 'reselect';
import { PropertyRequestStatus } from './definitions';
import COLORS from '../../../components/colors';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

type Props = {
  status: PropertyRequestStatus;
  resources: any;
};

const RequestIcon: React.FC<Props> = ({ status, resources }) => {
  switch (status) {
    case 'dirty':
      return <BrokenIcon />;
    case 'sended':
      return <SendIcon />;
    case 'accepted':
      return (
        <IconWrapper>
          <CheckIcon />
          {resources.ContentManagement.PropertyRequestStatusAccepted}
        </IconWrapper>
      );
    case 'rejected':
      return (
        <IconWrapper>
          <RejectedIcon />
          {resources.ContentManagement.PropertyRequestStatusRejected}
        </IconWrapper>
      );
    default:
      return null;
  }
};

const CheckIcon = withStyles({
  root: {
    color: COLORS.SUCCESS,
    marginRight: '8px',
  },
})(MuiCheckIcon);
const RejectedIcon = withStyles({
  root: {
    color: COLORS.ERROR,
    marginRight: '8px',
  },
})(MuiRejectedIcon);
const IconWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(RequestIcon);