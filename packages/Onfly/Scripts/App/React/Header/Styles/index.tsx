import styled from '@emotion/styled';

/* Shared styles */
type NavProps = {
  hasSidebar: boolean;
  isLoginPage: boolean;
};

export const Nav = styled.nav<NavProps>(({ hasSidebar, isLoginPage }) => ({
  left: hasSidebar ? '50px' : 0,
  top: 0,
  right: 0,
  height: '59px',
  display: 'flex',
  justifyContent: isLoginPage ? 'flex-end' : 'space-between',
  alignItems: 'center',
  zIndex: 2000,
  position: 'fixed',
  background: isLoginPage ? 'none' : '#fff',
  borderBottom: isLoginPage ? '0' : '1px solid #e2e4e5',
}));