import React from 'react';
import { TableRow, TableCell } from '@bim-co/componentui-foundation';
import { Subset } from '../../../Reducers/Sets/Subsets/types';

type Props = {
  subset: Subset;
  columns: {
    id: string;
    [x: string]: any;
  }[];
};

/**
 * Component representing a subset used in a table/list
 */
const SubsetRow: React.FC<Props> = ({ subset, columns }) =>
  subset && (
    <TableRow key={subset.Id}>
      {columns.map((column) => (
        <TableCell key={`${subset.Id}-${column.id}`}>{column.renderItem(subset)}</TableCell>
      ))}
    </TableRow>
  );

export default SubsetRow;