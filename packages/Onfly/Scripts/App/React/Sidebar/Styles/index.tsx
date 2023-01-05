import styled from '@emotion/styled';
import { defaultTheme } from '@bim-co/componentui-foundation';
import COLORS from '../../../components/colors';

/* Shared styles */

// Displays the submenu up
const SubMenuUpStyle = {
  ul: {
    top: 'initial',
    bottom: '50px',
  },
  '.arrow-icon': {
    transform: 'rotate(180deg)',
  },
};

// Sidebar
export const SidebarContainer = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '50px',
  zIndex: 3002,
  boxShadow: '10px 0 20px 0 rgba(0, 0, 0, 0.05)',
  backgroundColor: defaultTheme.backgroundColor,
  '@media (max-height: 900px)': {
    'li:nth-of-type(n+6)': SubMenuUpStyle,
  },
  '.bottom-menu': SubMenuUpStyle,
});

// Picture
export const PictureContainer = styled.div({
  position: 'relative',
  display: 'flex',
  height: '58px',
  width: '100%',
  backgroundColor: COLORS.EMPTY,
  justifyContent: 'center',
  alignItems: 'center',
});