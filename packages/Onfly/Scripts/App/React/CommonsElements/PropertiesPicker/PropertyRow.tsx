import React from 'react';
import { TableRow, TableCell } from '@bim-co/componentui-foundation';
import { Property } from '../../../Reducers/PropertiesV10/types';

type Props = {
  property: Property;
  columns: any[];
};

/**
 * Component representing a property used in a table / list
 */
const PropertyRow: React.FC<Props> = ({ property, columns }) =>
  property && (
    <TableRow key={property.Id}>
      {columns.map((column) => (
        <TableCell key={`${property.Id}-${column.id}`}>{column.renderItem(property)}</TableCell>
      ))}
    </TableRow>
  );

export default PropertyRow;