import React from 'react';
import styled from '@emotion/styled';
import COLORS from '../components/colors';

const Container = styled.div({
  position: 'fixed',
  left: '50px',
  right: 0,
  bottom: '20px',
  display: 'none',
  pointerEvents: 'none',
  zIndex: '1000',
});

const GoTopButton = styled.button({
  display: 'block',
  width: '48px',
  height: '48px',
  background: `${COLORS.EMPTY} url(/Content/images/rocket-small.svg) no-repeat center center`,
  backgroundSize: '40%',
  border: 0,
  borderRadius: '50%',
  boxShadow: '0 5px 10px rgba(33, 33, 33, 0.1)',
  cursor: 'pointer',
  transition: 'background 0.3s ease',
  pointerEvents: 'all',
  margin: '0 auto',
  '&:hover': {
    boxShadow: '0 5px 10px rgba(33, 33, 33, 0.2)',
  },
});

const GoTop = () => {
  const onClickGoTop = () => {
    $('html, body').animate({ scrollTop: 0 }, 900);
  };

  return (
    <Container id="go-top">
      <GoTopButton onClick={onClickGoTop} />
    </Container>
  );
};

export default GoTop;