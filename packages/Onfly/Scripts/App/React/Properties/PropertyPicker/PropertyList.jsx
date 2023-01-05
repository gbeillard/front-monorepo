import React from 'react';
import styled from '@emotion/styled';
import { List } from '@material-ui/core';
import Property from './Property.jsx';

const LongList = styled(List)({
  width: '100%',
});
const PropertyList = ({ propertyList, onPropertyClicked }) => {
  const list = propertyList.map((property) => (
    <Property key={property.Id} property={property} onPropertyClicked={onPropertyClicked} />
  ));
  return <LongList>{list}</LongList>;
};

export default PropertyList;