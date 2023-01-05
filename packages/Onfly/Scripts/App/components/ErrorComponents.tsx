import styled from '@emotion/styled';

export const ErrorPageContainer = styled.div({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  width: '100%',
  background: '#FAFAFA',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  zIndex: 99999,
  h1: {
    fontSize: '54px',
    marginBottom: '48px',
  },
});

export const ErrorPageTitle = styled.h1({
  display: 'block',
  width: '100%',
  lineHeight: '38px',
  textAlign: 'center',
});

export const ErrorPageSubTitle = styled.p({
  marginBottom: '20px',
  color: '#676767',
  textAlign: 'center',
  fontSize: '14px',
  lineHeight: '23px',
});