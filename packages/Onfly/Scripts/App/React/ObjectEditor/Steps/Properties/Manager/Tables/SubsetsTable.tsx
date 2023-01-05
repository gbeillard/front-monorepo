import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';

import {
  space,
  colors,
  getColorNameFromId,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tag,
  Button,
  Paragraph,
} from '@bim-co/componentui-foundation';

import { Subset, SubsetSource } from '../../../../../../Reducers/Sets/Subsets/types';

import { selectTranslatedResources } from '../../../../../../Reducers/app/selectors';

type Props = {
  resources: any;
  subsets: Subset[];
  onDelete: (subset: Subset) => void;
};

const SubsetsTable: React.FC<Props> = ({ subsets, resources, onDelete }) => {
  const handleClickDeleteSubset = (subset: Subset, isDeletable: boolean) => {
    isDeletable && onDelete(subset);
  };

  const tableRows = ([...subsets, ...[null]] || []).map((subset) => {
    const isDeletable = !subset?.Sources?.includes(SubsetSource.Node);

    return (
      subset && (
        <TableRow key={subset.Id} hover>
          <TableCell>{subset.Set?.Name}</TableCell>
          <TableCell>
            {!subset.IsDefault && (
              <Tag.ColorTag color={getColorNameFromId(subset.Id)}>{subset.Name}</Tag.ColorTag>
            )}
          </TableCell>
          <TableCell>
            <SecondaryParagraph nowrap>{subset.Set?.Description}</SecondaryParagraph>
          </TableCell>
          <TableCell width={space[250]}>
            <Button
              size="dense"
              variant="alternative"
              icon="delete"
              isDisabled={!isDeletable}
              onClick={() => handleClickDeleteSubset(subset, isDeletable)}
            />
          </TableCell>
        </TableRow>
      )
    );
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{resources.ObjectPropertiesManager.NameColumn}</TableCell>
          <TableCell>{resources.ObjectPropertiesManager.SubsetColumn}</TableCell>
          <TableCell>{resources.ObjectPropertiesManager.DescriptionColumn}</TableCell>
          <TableCell width={space[250]} />
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
};

const SecondaryParagraph = styled(Paragraph)`
  color: ${colors.NEUTRAL[60]};
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(SubsetsTable);