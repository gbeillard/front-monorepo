import React from 'react';
import styled from '@emotion/styled';
import { ListItem } from '@material-ui/core';

const Name = styled.span({ flexBasis: '50%' });
const Description = styled.span({
  flexBasis: '50%',
  overflow: 'hidden',
  wordSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
const Property = ({ property, onPropertyClicked }) => {
  const onClickHandler = () => {
    onPropertyClicked(property);
  };
  return (
    <ListItem button onClick={onClickHandler}>
      <Name>{property.Name}</Name>
      <Description>{property.Description}</Description>
    </ListItem>
  );
};

export default Property;