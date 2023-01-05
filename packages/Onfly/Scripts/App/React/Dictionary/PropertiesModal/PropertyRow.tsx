import React from 'react';
import { TableRow, TableCell, Checkbox } from '@material-ui/core';
import { Property } from './definitions';

type Props = {
  property: Property;
  onPropertyChanged: (x: Property) => void;
};

const PropertyRow: React.FC<Props> = ({ property, onPropertyChanged }) => {
  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onPropertyChanged({ ...property, selected: event.target.checked });
  };
  return (
    <TableRow key={property.Id}>
      <TableCell>
        <Checkbox
          color="primary"
          checked={property.selected || property.isAlreadyAssociated}
          onChange={onChangeHandler}
          disabled={property.isAlreadyAssociated}
        />
      </TableCell>
      <TableCell>{property.Name}</TableCell>
      <TableCell>{property.Domain.Name}</TableCell>
      <TableCell>{property.Unit.Name}</TableCell>
    </TableRow>
  );
};

export default PropertyRow;