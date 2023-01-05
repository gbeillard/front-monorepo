import React from 'react';
import styled from '@emotion/styled';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Tooltip } from '@material-ui/core';
import COLORS from '../../../components/colors';

const Wrapper = styled.div({
  backgroundColor: COLORS.P90,
  color: COLORS.EMPTY,
  padding: '2px 8px',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  maxWidth: '100%',
});
const Label = styled.span({
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});
const DeleteIcon = styled(HighlightOffIcon)({
  width: '16px',
  height: '16px',
  marginLeft: '4px',
  cursor: 'pointer',
});
const SelectedProperty = ({ label, onDelete }) => (
  <Tooltip title={label} enterDelay={500}>
    <Wrapper>
      <Label>{label}</Label>
      <DeleteIcon onClick={onDelete} />
    </Wrapper>
  </Tooltip>
);

export default SelectedProperty;