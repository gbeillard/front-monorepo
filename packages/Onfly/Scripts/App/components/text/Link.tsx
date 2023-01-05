import React from 'react';
import styled from '@emotion/styled';
import COLORS from '../colors';
import SIZES from '../sizes';

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const StyledLink = styled.a(() => ({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: SIZES.FONTS.LINK,
  lineHeight: SIZES.LINE_HEIGHTS.LINK,
  cursor: 'pointer',
  color: `${COLORS.SECONDARY} !important`,
  '&:hover': {
    color: `${COLORS.SECONDARY} !important`,
  },
}));

const Link: React.FunctionComponent<Props> = ({ ...otherProps }) => <StyledLink {...otherProps} />;

export default Link;