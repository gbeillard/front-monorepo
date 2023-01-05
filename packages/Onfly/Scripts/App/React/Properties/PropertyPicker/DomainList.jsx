import React from 'react';
import styled from '@emotion/styled';
import Domain from './Domain.jsx';

const CenterDiv = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const DomainList = ({ domains, onPropertyClicked }) => {
  if (domains.length < 1) {
    return <CenterDiv>Aucune propriété ne correspond à votre recherche</CenterDiv>;
  }
  const list = domains.map((domain) => (
    <Domain key={domain.Id} domain={domain} onPropertyClicked={onPropertyClicked} />
  ));
  return <div>{list}</div>;
};

export default DomainList;