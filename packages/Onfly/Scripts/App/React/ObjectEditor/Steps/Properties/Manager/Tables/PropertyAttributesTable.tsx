import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';

import {
  space,
  colors,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paragraph,
} from '@bim-co/componentui-foundation';

import { Property } from '../../../../../../Reducers/BimObject/Properties/types';
import { selectTranslatedResources } from '../../../../../../Reducers/app/selectors';

type Props = {
  resources: any;
  properties: Property[];
  onDelete: (property: Property) => void;
};

const PropertyTable: React.FC<Props> = ({ properties, resources, onDelete }) => {
  const tableRows = (properties || []).map((property) => (
    <TableRow key={property.Id} hover>
      <TableCell minWidth={space[1000]}>{property.Name}</TableCell>
      <TableCell width={space[1000]}>{property.Domain?.Name}</TableCell>
      <TableCell width={space[600]}>{property.DefaultUnit?.Symbol}</TableCell>
      <TableCell minWidth={space[1000]}>
        <SecondaryParagraph nowrap>{property.Description}</SecondaryParagraph>
      </TableCell>
      <TableCell width={space[250]}>
        <Button
          size="dense"
          variant="alternative"
          icon="delete"
          isDisabled={!property?.CanBeDeleted}
          onClick={() => {
            property?.CanBeDeleted && onDelete(property);
          }}
        />
      </TableCell>
    </TableRow>
  ));

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell minWidth={space[1000]}>
            {resources.ObjectPropertiesManager.NameColumn}
          </TableCell>
          <TableCell width={space[1000]}>
            {resources.ObjectPropertiesManager.DomainColumn}
          </TableCell>
          <TableCell width={space[600]}>{resources.ObjectPropertiesManager.UnitColumn}</TableCell>
          <TableCell minWidth={space[1000]}>
            {resources.ObjectPropertiesManager.DescriptionColumn}
          </TableCell>
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

export default connect(mapStateToProps)(PropertyTable);