import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { CSSObject, keyframes } from '@emotion/react';
import { defaultTheme } from '@bim-co/componentui-foundation';
import MuiKeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import COLORS from '../../../components/colors';

type Props = {
  name?: string;
  link?: string;
  icon?: any;
  badge?: number;
  handleClick?: () => void;
  isBeta?: boolean;
  dangerouslySetInnerHTML?: string;
  isExternalLink?: boolean;
};

const MENU_ITEM_WIDTH = 380;

const ListItem = styled.li({
  position: 'relative',
  height: '50px',
  width: '50px',
  backgroundColor: defaultTheme.backgroundColor,
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    width: `${MENU_ITEM_WIDTH}px`,
    overflow: 'visible',
    '>a': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
  },
});

const linkStyle: CSSObject = {
  position: 'relative',
  display: 'flex',
  width: `${MENU_ITEM_WIDTH}px`,
  height: '100%',
  alignItems: 'center',
  color: `${defaultTheme.textColorTertiary} !important`,
  fontSize: '12px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  '.menu-item-bold': {
    fontWeight: 600,
  },
  '&:hover, &:focus': {
    textDecoration: 'none',
  },
  '&:hover': {
    color: `${defaultTheme.textColorOnSecondary} !important`,
  },
};

const StyledLink = styled(NavLink)(linkStyle);

const StyledA = styled.a(linkStyle);

const alertAnimation = keyframes({
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

const BadgeAlert = styled.span({
  position: 'absolute',
  top: '12px',
  left: '34px',
  display: 'block',
  width: '7px',
  height: '7px',
  backgroundColor: '#3FA750',
  borderRadius: '50%',
  animation: `${alertAnimation} 1s 4`,
});

const Badge = styled.span({
  position: 'relative',
  display: 'inline-flex',
  minWidth: '20px',
  height: '20px',
  marginLeft: '5px',
  padding: '0 6px',
  backgroundColor: '#3FA750',
  borderRadius: '10px',
  color: COLORS.EMPTY,
  fontSize: '12px',
  fontWeight: 500,
  textAlign: 'center',
  alignItems: 'center',
});

const BadgeBeta = styled.span({
  display: 'inline-block',
  height: '16px',
  marginTop: '2px',
  padding: '1px 3px',
  background: '#676767',
  border: `1px solid ${COLORS.EMPTY}`,
  borderRadius: '4px',
  color: COLORS.EMPTY,
  fontSize: '10px',
  textAlign: 'center',
});

const IconContainer = styled.span({
  width: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  'svg, .icon-menu': {
    height: '18px',
    width: '18px',
    fontSize: '18px',
  },
  '.icon-menu': {
    display: 'inline-block',
    height: '14px',
    background: 'no-repeat center center',
    backgroundSize: 'contain',
    verticalAlign: 'middle',
  },
  '.icon-cubes': {
    backgroundImage: 'url(/Content/images/icon-cubes.svg)',
  },
});

const ChildrenList = styled.ul({
  position: 'absolute',
  left: '50px',
  width: '330px',
  overflowY: 'auto',
  li: {
    width: '100%',
    height: 'inherit',
    padding: '0 10px 0 0',
    a: {
      display: 'block',
      height: '32px',
      width: '100%',
      color: defaultTheme.textColorTertiary,
      lineHeight: '32px',
      overflow: 'hidden',
      margin: '5px 0 0 0',
      padding: '0 15px',
      'svg, .icon-menu': {
        width: '20px',
      },
      '.icon-container': {
        display: 'inline-flex',
        width: '20px',
        marginRight: '5px',
        verticalAlign: 'middle',
      },
    },
    '&:hover a, a.active': {
      backgroundColor: defaultTheme.backgroundColor,
      borderRadius: '50px',
      color: `${defaultTheme.textColorOnSecondary} !important`,
      '.icon-cubes': {
        backgroundImage: 'url(/Content/images/icon-cubes-hover.svg)',
      },
    },
    '&:first-of-type': {
      paddingTop: '5px',
    },
    '&:last-of-type': {
      paddingBottom: '10px',
    },
    '&:hover': {
      width: '100%',
      overflow: 'hidden',
      color: defaultTheme.textColorOnSecondary,
    },
  },
});

const KeyboardArrowDownIcon = styled(MuiKeyboardArrowDownIcon)({
  position: 'absolute',
  right: '10px',
  width: '20px',
});

const Text = styled.span({
  lineHeight: '12px',
  verticalAlign: 'middle',
});

const MenuItem: React.FC<Props> = ({
  name = '',
  link = '',
  icon = null,
  badge = 0,
  handleClick = null,
  isBeta = false,
  dangerouslySetInnerHTML = '',
  isExternalLink = false,
  children,
}) => {
  const Component = isExternalLink ? StyledA : StyledLink;
  return (
    <ListItem>
      <Component
        to={link}
        {...(isExternalLink ? { href: link } : {})}
        className={`${isExternalLink ? '' : ({ isActive }) => isActive && 'active'}`}
        onClick={handleClick}
        target={isExternalLink ? '_blank' : ''}
      >
        <IconContainer className={icon || isExternalLink ? 'icon-container' : ''}>
          {isExternalLink ? <OpenInNewIcon /> : icon}
          {isBeta && <BadgeBeta>BETA</BadgeBeta>}
        </IconContainer>
        {badge > 0 && <BadgeAlert />}
        {dangerouslySetInnerHTML !== '' ? (
          <Text dangerouslySetInnerHTML={{ __html: dangerouslySetInnerHTML }} />
        ) : (
          <Text>{name}</Text>
        )}
        {badge > 0 && <Badge>{badge}</Badge>}
        {children && <KeyboardArrowDownIcon className="arrow-icon" />}
      </Component>
      {children && <ChildrenList className="sub-menu">{children}</ChildrenList>}
    </ListItem>
  );
};

export default MenuItem;